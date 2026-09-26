import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from './config';

/**
 * Register a new user with Email, Password, Name, and initial Level
 */
export async function registerWithEmail(email, password, name, level = 'HSK 1 - Sơ cấp') {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update Auth Profile
  await updateProfile(user, {
    displayName: name,
    photoURL: ''
  });

  // Save Initial Profile into Firestore `users` collection with graceful permission fallback
  const userDocRef = doc(db, 'users', user.uid);
  const initialData = {
    uid: user.uid,
    name: name,
    email: email,
    level: level,
    avatar: user.photoURL || null,
    streak: 0,
    xp: 0,
    wordsLearned: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(userDocRef, initialData);
  } catch (firestoreErr) {
    console.warn('Firestore write warning (Rules may need to be updated in Firebase Console):', firestoreErr);
  }

  return initialData;
}

/**
 * Login with Email and Password
 */
export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Fetch user profile from Firestore with fallback
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    }
  } catch (err) {
    console.warn('Firestore read error (Check rules in Firebase Console):', err);
  }

  return {
    uid: user.uid,
    name: user.displayName || email.split('@')[0],
    email: user.email,
    level: 'HSK 1 - Sơ cấp',
    avatar: user.photoURL || null,
    streak: 0,
    xp: 0
  };
}

/**
 * Login with Google Popup
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }

    const newUser = {
      uid: user.uid,
      name: user.displayName || 'Học viên HanziGo',
      email: user.email,
      level: 'HSK 1 - Sơ cấp',
      avatar: user.photoURL || null,
      streak: 0,
      xp: 0,
      wordsLearned: 0,
      createdAt: serverTimestamp()
    };
    await setDoc(userDocRef, newUser);
    return newUser;
  } catch (err) {
    console.warn('Firestore read/write error during Google login:', err);
    return {
      uid: user.uid,
      name: user.displayName || 'Học viên HanziGo',
      email: user.email,
      level: 'HSK 1 - Sơ cấp',
      avatar: user.photoURL || null,
      streak: 0,
      xp: 0
    };
  }
}

/**
 * Sign out
 */
export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
}

/**
 * Save / Update User Progress (XP, Streak, Completed Lessons) to Firestore
 */
export async function saveUserProgress(uid, progressData) {
  if (!isFirebaseConfigured || !db || !uid) return;

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      ...progressData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error('Failed to sync progress to Firestore:', err);
  }
}

/**
 * Get Community Posts from Firestore
 */
export async function getCommunityPosts() {
  if (!isFirebaseConfigured || !db) return null;

  try {
    const q = query(collection(db, 'community_posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      posts.push({
        id: docSnap.id,
        ...data,
        time: data.time || 'Vừa xong'
      });
    });
    return posts;
  } catch (err) {
    console.warn('Could not fetch Firestore community posts:', err);
    return null;
  }
}

/**
 * Add a Community Post to Firestore
 */
export async function addCommunityPost(postData) {
  if (!isFirebaseConfigured || !db) return null;

  try {
    const docRef = await addDoc(collection(db, 'community_posts'), {
      ...postData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.error('Could not create Firestore post:', err);
    return null;
  }
}

/**
 * Update Community Post in Firestore (Likes, comments, etc.)
 */
export async function updateCommunityPost(postId, updateData) {
  if (!isFirebaseConfigured || !db || !postId) return false;

  try {
    const docRef = doc(db, 'community_posts', String(postId));
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (err) {
    console.warn('Could not update Firestore post:', err);
    return false;
  }
}

/**
 * Delete Community Post from Firestore
 */
export async function deleteCommunityPost(postId) {
  if (!isFirebaseConfigured || !db || !postId) return false;

  try {
    const docRef = doc(db, 'community_posts', String(postId));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Could not delete Firestore post:', err);
    return false;
  }
}

/**
 * Get Study Partners from Firestore
 */
export async function getStudyPartnersFromDb() {
  if (!isFirebaseConfigured || !db) return null;

  try {
    const q = query(collection(db, 'study_partners'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const partners = [];
    querySnapshot.forEach((docSnap) => {
      partners.push({ id: docSnap.id, ...docSnap.data() });
    });
    return partners;
  } catch (err) {
    console.warn('Could not fetch Firestore study partners:', err);
    return null;
  }
}

/**
 * Add Study Partner to Firestore
 */
export async function addStudyPartnerToDb(partnerData) {
  if (!isFirebaseConfigured || !db) return null;

  try {
    const docRef = await addDoc(collection(db, 'study_partners'), {
      ...partnerData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.error('Could not create Firestore study partner:', err);
    return null;
  }
}

/**
 * Delete Study Partner from Firestore
 */
export async function deleteStudyPartnerFromDb(partnerId) {
  if (!isFirebaseConfigured || !db || !partnerId) return false;

  try {
    const docRef = doc(db, 'study_partners', String(partnerId));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Could not delete Firestore study partner:', err);
    return false;
  }
}

/**
 * =========================================================================
 * REAL-TIME DB SYNC ACROSS ALL PAGES (VOCAB, ROADMAP, PRONUNCIATION, 
 * WRITING, AI CHAT, MATERIALS, DASHBOARD & LESSONS)
 * =========================================================================
 */

/**
 * Trigger an asynchronous background sync of all local user learning progress to Firestore DB
 */
export async function triggerCloudSync(uid = null) {
  if (!isFirebaseConfigured || !db) return;
  
  let targetUid = uid;
  if (!targetUid) {
    try {
      const saved = localStorage.getItem('hanzigo_user');
      if (saved) {
        const u = JSON.parse(saved);
        targetUid = u?.uid;
      }
    } catch {
      targetUid = null;
    }
  }

  if (!targetUid) return;

  try {
    // Read all user-generated data across pages
    const rawCustomVocab = localStorage.getItem('hanzigo_custom_vocab');
    const rawRemembered = localStorage.getItem('hanzigo_vocab_remembered');
    const rawReview = localStorage.getItem('hanzigo_vocab_review');
    const rawCustomPronounce = localStorage.getItem('hanzigo_custom_pronounce_list');
    const rawPronounceHistory = localStorage.getItem('hanzigo_pronounce_history');
    const rawCustomWriting = localStorage.getItem('hanzigo_custom_writing_chars');
    const rawChatHistory = localStorage.getItem('hanzigo_ai_chat_history');
    const rawCustomLessons = localStorage.getItem('hanzigo_custom_lessons');
    const rawCompletedLessons = localStorage.getItem('hanzigo_completed_lessons');
    const rawCustomMaterials = localStorage.getItem('hanzigo_custom_materials');
    const rawSavedMaterials = localStorage.getItem('hanzigo_saved_materials') || localStorage.getItem('hanzigo_bookmarked_materials');
    const rawDailyGoal = localStorage.getItem('hanzigo_daily_goal');

    const learningPayload = {
      uid: targetUid,
      customVocab: rawCustomVocab ? JSON.parse(rawCustomVocab) : [],
      rememberedWords: rawRemembered ? JSON.parse(rawRemembered) : [],
      reviewWords: rawReview ? JSON.parse(rawReview) : [],
      customPronounceList: rawCustomPronounce ? JSON.parse(rawCustomPronounce) : [],
      pronounceHistory: rawPronounceHistory ? JSON.parse(rawPronounceHistory) : [],
      customWritingChars: rawCustomWriting ? JSON.parse(rawCustomWriting) : [],
      chatHistory: rawChatHistory ? JSON.parse(rawChatHistory) : {},
      customLessons: rawCustomLessons ? JSON.parse(rawCustomLessons) : [],
      completedLessons: rawCompletedLessons ? JSON.parse(rawCompletedLessons) : [],
      customMaterials: rawCustomMaterials ? JSON.parse(rawCustomMaterials) : [],
      savedMaterials: rawSavedMaterials ? JSON.parse(rawSavedMaterials) : [],
      dailyGoal: rawDailyGoal ? Number(rawDailyGoal) : 15,
      updatedAt: serverTimestamp()
    };

    // 1. Sync detailed learning bundle to Firestore
    const learningDocRef = doc(db, 'users_learning_data', targetUid);
    await setDoc(learningDocRef, learningPayload, { merge: true });

    // 2. Sync high-level stats to user profile doc
    const userDocRef = doc(db, 'users', targetUid);
    await setDoc(userDocRef, {
      wordsLearned: (learningPayload.rememberedWords || []).length,
      completedLessonsCount: (learningPayload.completedLessons || []).length,
      customVocabCount: (learningPayload.customVocab || []).length,
      customLessonsCount: (learningPayload.customLessons || []).length,
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log('✅ HanziGo Cloud DB: All pages synced to Firestore successfully for user', targetUid);
  } catch (err) {
    console.warn('⚠️ HanziGo Cloud DB Sync notice:', err);
  }
}

/**
 * Hydrate and restore all user learning progress from Firestore DB into localStorage
 */
export async function loadAllUserDataFromDb(uid) {
  if (!isFirebaseConfigured || !db || !uid) return null;

  try {
    const learningDocRef = doc(db, 'users_learning_data', uid);
    const learningSnap = await getDoc(learningDocRef);

    if (learningSnap.exists()) {
      const data = learningSnap.data();

      // Hydrate all pages' local state
      if (Array.isArray(data.customVocab)) {
        localStorage.setItem('hanzigo_custom_vocab', JSON.stringify(data.customVocab));
      }
      if (Array.isArray(data.rememberedWords)) {
        localStorage.setItem('hanzigo_vocab_remembered', JSON.stringify(data.rememberedWords));
      }
      if (Array.isArray(data.reviewWords)) {
        localStorage.setItem('hanzigo_vocab_review', JSON.stringify(data.reviewWords));
      }
      if (Array.isArray(data.customPronounceList)) {
        localStorage.setItem('hanzigo_custom_pronounce_list', JSON.stringify(data.customPronounceList));
      }
      if (Array.isArray(data.pronounceHistory)) {
        localStorage.setItem('hanzigo_pronounce_history', JSON.stringify(data.pronounceHistory));
      }
      if (Array.isArray(data.customWritingChars)) {
        localStorage.setItem('hanzigo_custom_writing_chars', JSON.stringify(data.customWritingChars));
      }
      if (data.chatHistory && typeof data.chatHistory === 'object') {
        localStorage.setItem('hanzigo_ai_chat_history', JSON.stringify(data.chatHistory));
      }
      if (Array.isArray(data.customLessons)) {
        localStorage.setItem('hanzigo_custom_lessons', JSON.stringify(data.customLessons));
      }
      if (Array.isArray(data.completedLessons)) {
        localStorage.setItem('hanzigo_completed_lessons', JSON.stringify(data.completedLessons));
      }
      if (Array.isArray(data.customMaterials)) {
        localStorage.setItem('hanzigo_custom_materials', JSON.stringify(data.customMaterials));
      }
      if (Array.isArray(data.savedMaterials)) {
        localStorage.setItem('hanzigo_saved_materials', JSON.stringify(data.savedMaterials));
        localStorage.setItem('hanzigo_bookmarked_materials', JSON.stringify(data.savedMaterials));
      }
      if (data.dailyGoal) {
        localStorage.setItem('hanzigo_daily_goal', String(data.dailyGoal));
      }

      console.log('✅ HanziGo Cloud DB: All pages hydrated successfully from Firestore for user', uid);
      return data;
    }
  } catch (err) {
    console.warn('⚠️ Could not load user data from Firestore:', err);
  }
  return null;
}


