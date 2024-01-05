import { serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/app/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    doc,
    query,
    where,
    orderBy,
    deleteDoc,
    limit,
    select,
} from "@firebase/firestore";

// save the post to database
export const createNewPost = async (postObj) => {
    try {
        // Add createdAt field to the post object
        const postWithTimestamp = {
            ...postObj,
            createdAt: serverTimestamp(), // Add the server timestamp to createdAt field
        };

        const postRef = await addDoc(
            collection(db, "posts"),
            postWithTimestamp
        );
        console.log("post created successfylly with id...", postRef.id);
        // Return the newly created document
        return postRef.id;
    } catch (error) {
        console.error("Error creating post: ", error);
        throw error;
    }
};

// fetch most recent posts by limit
export const fetchMostRecentPosts = async (count) => {
    try {
        // if (!count) {
        //     count = 10;
        // }
        const postData = [];
        const postRef = collection(db, "posts");
        let q;
        if (count) {
            q = query(postRef, orderBy("createdAt", "desc"), limit(count));
        } else {
            q = query(postRef, orderBy("createdAt", "desc"));
        }
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((post) => {
            const { comments, ...postDataWithoutComments } = post.data();
            postData.push({ id: post.id, ...postDataWithoutComments });
        });

        console.log(`${postData.length} posts fetched successfully...`);

        return postData;
    } catch (error) {
        console.error("Error fetching posts...: ", error);
        throw error;
    }
};
// fetch one post with given id and return it
export const fetchOnePost = async (postId) => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnapshot = await getDoc(postRef);

        if (postSnapshot.exists()) {
            return { id: postSnapshot.id, ...postSnapshot.data() };
            console.log("post fetched successfully...", postSnapshot.data());
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching post by ID: ", error);
        throw error; // You can handle errors appropriately in your application
    }
};

// add comment to a given post with id
export const addComment = async (postId, comment, name) => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnapshot = await getDoc(postRef);

        const updatedPostObj = {
            comment: comment,
            name: name,
        };

        if (postSnapshot.exists()) {
            const updatedComments = [
                ...postSnapshot.data().comments,
                updatedPostObj,
            ];
            await updateDoc(postRef, {
                comments: updatedComments,
                commentsCount: updatedComments.length,
            });
            console.log("comment added successfully...", updatedComments);
            return;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error adding comment: ", error);
        throw error; // You can handle errors appropriately in your application
    }
};
// add like count to a given post with id
export const addLikeOfPost = async (postId) => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnapshot = await getDoc(postRef);

        if (postSnapshot.exists()) {
            const updatedLikes = postSnapshot.data().likes + 1;
            await updateDoc(postRef, {
                likes: updatedLikes,
            });
            console.log("like added successfully...", updatedLikes);
            return;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error adding like: ", error);
        throw error; // You can handle errors appropriately in your application
    }
};
// // ****************************** Image upload to firebase storage *******************************
// // uploading one file to firebase storage
// export const uploadFileToStorage = async (selectedFile) => {
//     const storageRef = ref(storage, `dealersImage/${selectedFile.name}`);

//     try {
//         // Upload the selected file to Firebase Storage
//         const snapshot = await uploadBytes(storageRef, selectedFile);

//         const downloadURL = await getDownloadURL(storageRef);

//         return downloadURL; // Resolve the Promise with the download URL
//     } catch (error) {
//         throw error; // Reject the Promise if there's an error
//     }
// };

// // ****************************** INSPECTIN REPORT ROUTES *******************************

// // Function to fetch all reports from Firestore
// export const fetchAllReports = async () => {
//     try {
//         const inspectionData = [];
//         const carsRef = collection(db, "carsInspectionData");
//         const querySnapshot = await getDocs(carsRef);

//         querySnapshot.forEach((doc) => {
//             inspectionData.push({ id: doc.id, ...doc.data() });
//         });

//         return inspectionData;
//     } catch (error) {
//         console.error("Error fetching inspections data: ", error);
//         return [];
//     }
// };

// // fetchOneReport from firebase
// export const fetchOneReport = async (postId) => {
//     try {
//         const reportRef = doc(db, "carsInspectionData", postId);

//         const reportSnapshot = await getDoc(reportRef);

//         if (reportSnapshot.exists()) {
//             return { id: reportSnapshot.id, ...reportSnapshot.data() };
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching post by ID: ", error);
//         return null; // You can handle errors appropriately in your application
//     }
// };

// // update report with given id
// // update QC Status
// export const updateOneReport = async (id, field, value) => {
//     try {
//         const reportRef = doc(db, "carsInspectionData", id);
//         await updateDoc(reportRef, { [field]: value });

//         return value;
//     } catch (error) {
//         console.log("error updating report field...", error);
//         throw error;
//     }
// };

// export const deleteOneReport = async (id) => {
//     try {
//         const reportRef = doc(db, "carsInspectionData", id);
//         await deleteDoc(reportRef);
//         return true;
//     } catch (error) {
//         console.log("error deleting report");
//         throw error;
//     }
// };
// // ****************************** AUCTIONS ROUTES *******************************

// // fetching all post with isAuctionLive=true
// export const getLiveAuctions = async (email) => {
//     try {
//         const reportRef = collection(db, "carsInspectionData");
//         const q = query(reportRef, where("isAuctionLive", "==", true));
//         const querySnapshot = await getDocs(q);

//         if (querySnapshot.empty) {
//             console.log("reports do not exist");
//             return null;
//         } else {
//             const data = querySnapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(), // Extract the document data
//             }));
//             console.log("reports with live auction are: ", data);
//             return data;
//         }
//     } catch (error) {
//         console.log("error getting user", error);
//         throw error;
//     }
// };

// // update QC Status
// export const updateQCStatus = async (id, value) => {
//     try {
//         const reportRef = doc(db, "carsInspectionData", id);
//         const res = await updateDoc(reportRef, { qcStatus: value });
//         console.log("qc status updated successfully", res);
//         return res;
//     } catch (error) {
//         console.log("error updating qc status...", error);
//         throw error;
//     }
// };

// // ************************* DEALER API ROUTES *****************************
// // function to create a new dealer

// export const createDealer = async (dealerObj) => {
//     // Add createdAt field to the dealer object
//     const carLeadWithTimestamp = {
//         ...dealerObj,
//         createdAt: serverTimestamp(), // Add the server timestamp to createdAt field
//     };

//     try {
//         const postRef = await addDoc(
//             collection(db, "dealersData"),
//             carLeadWithTimestamp
//         );
//         return postRef.id; // Return the newly created document
//     } catch (error) {
//         console.error("Error creating dealer: ", error);
//         throw error;
//     }
// };

// // Function to ALL dealers from Firestore
// export const fetchAllDealers = async () => {
//     try {
//         const dealersData = [];
//         const dealersRef = collection(db, "dealersData");
//         // const querySnapshot = await getDocs(dealersRef);

//         // Query the documents and order them by the timestamp field (createdAt)

//         const q = query(dealersRef, orderBy("createdAt", "desc"));
//         const querySnapshot = await getDocs(q);

//         querySnapshot.forEach((doc) => {
//             dealersData.push({ id: doc.id, ...doc.data() });
//         });

//         return dealersData;
//     } catch (error) {
//         console.error("Error fetching dealers data: ", error);
//         return [];
//     }
// };
// // Function to one dealer from Firestore
// export const fetchOneDealer = async (dealerId) => {
//     try {
//         const dealersRef = doc(db, "dealersData", dealerId);

//         const querySnapshot = await getDoc(dealersRef);

//         if (querySnapshot.exists()) {
//             return { id: querySnapshot.id, ...querySnapshot.data() };
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching dealer data: ", error);
//         throw error;
//     }
// };

// export const deleteOneDealer = async (id) => {
//     try {
//         const reportRef = doc(db, "dealersData", id);
//         await deleteDoc(reportRef);
//         return true;
//     } catch (error) {
//         console.log("error deleting report");
//         throw error;
//     }
// };
// // hello

// // update dealer field
// export const updateDealer = async (id, mainField, field, value) => {
//     try {
//         const dealerRef = doc(db, "dealersData", id);
//         // Construct the update object with nested fields
//         const updateObj = {
//             [`dealerInfo.${mainField}.${field}`]: value,
//         };

//         await updateDoc(dealerRef, updateObj);
//         return "Update successful"; // Optional: Return a success message or data
//     } catch (error) {
//         console.log(`Error updating ${mainField + field} status:`, error);
//         throw error;
//     }
// };

// // ******************************** Lead id  *****************************************************

// export const createCarLead = async (leadObj) => {
//     // Add createdAt field to the dealer object
//     const carLeadWithTimestamp = {
//         ...leadObj,
//         createdAt: serverTimestamp(), // Add the server timestamp to createdAt field
//     };

//     try {
//         const postRef = await addDoc(
//             collection(db, "carLeads"),
//             carLeadWithTimestamp
//         );
//         return postRef.id; // Return the newly created document
//     } catch (error) {
//         console.error("Error creating lead: ", error);
//         throw error;
//     }
// };

// // Function to ALL dealers from Firestore
// export const fetchAllLeads = async () => {
//     try {
//         const carLeads = [];
//         const leadRef = collection(db, "carLeads");
//         // const querySnapshot = await getDocs(dealersRef);

//         // Query the documents and order them by the timestamp field (createdAt)

//         const q = query(leadRef, orderBy("createdAt", "desc"));
//         const querySnapshot = await getDocs(q);

//         querySnapshot.forEach((doc) => {
//             carLeads.push({ id: doc.id, ...doc.data() });
//         });

//         return carLeads;
//     } catch (error) {
//         console.error("Error fetching leads data: ", error);
//         return [];
//     }
// };

// // Function to one lead from Firestore
// export const fetchOneLead = async (leadId) => {
//     try {
//         const dealersRef = doc(db, "carLeads", leadId);
//         // const querySnapshot = await getDocs(dealersRef);

//         // Query the documents and order them by the timestamp field (createdAt)

//         const querySnapshot = await getDoc(dealersRef);

//         if (querySnapshot.exists()) {
//             return { id: querySnapshot.id, ...querySnapshot.data() };
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching dealer data: ", error);
//         throw error;
//     }
// };

// export const deleteOneLead = async (leadId) => {
//     try {
//         await deleteDoc(doc(db, "carLeads", leadId));
//         return true;
//     } catch (error) {
//         console.log("error deleting lead", error);
//         throw error;
//     }
// };

// // ************************  inspection engineer *******************************
// // fetch al inspection engineers
// export const fetchAllInspectionOfficers = async () => {
//     try {
//         const dealersData = [];
//         const dealersRef = collection(db, "inspectionEngineer");

//         // Query the documents and filter by the "verified" field where it's false

//         const querySnapshot = await getDocs(dealersRef);

//         querySnapshot.forEach((doc) => {
//             dealersData.push({ id: doc.id, ...doc.data() });
//         });

//         return dealersData;
//     } catch (error) {
//         console.error("Error fetching  inspection engineers: ", error);
//         return [];
//     }
// };
// // Function to ALL inspection officers from Firestore
// export const fetchUnverifiedInspectionOfficer = async () => {
//     try {
//         const dealersData = [];
//         const dealersRef = collection(db, "inspectionEngineer");

//         // Query the documents and filter by the "verified" field where it's false
//         const q = query(dealersRef, where("verified", "==", false));
//         const querySnapshot = await getDocs(q);

//         querySnapshot.forEach((doc) => {
//             dealersData.push({ id: doc.id, ...doc.data() });
//         });

//         return dealersData;
//     } catch (error) {
//         console.error(
//             "Error fetching not verified inspection engineers: ",
//             error
//         );
//         return [];
//     }
// };

// // update verfiy status of officer
// export const updateVerifyOfficer = async (email, value) => {
//     console.log("email is: ", email, "value is: ", value);

//     try {
//         const ref = collection(db, "inspectionEngineer");
//         const q = query(ref, where("email", "==", email));
//         const querySnapshot = await getDocs(q);

//         const doc = querySnapshot.docs[0];
//         await updateDoc(doc.ref, { verified: value });

//         return value;
//     } catch (error) {
//         console.log("Error updating verified status of officer:", error);
//         throw error;
//     }
// };

// // delete one inspection officer
// export const deleteOneInspectionOfficer = async (id) => {
//     try {
//         const reportRef = doc(db, "inspectionEngineer", id);
//         await deleteDoc(reportRef);
//         return true;
//     } catch (error) {
//         console.log("error deleting inspection engineer ", error);
//         throw error;
//     }
// };

// export const updateLeadInEngineerDoc = async (leaObj, name, email) => {
//     try {
//         // Add createdAt field to the dealer object
//         const reportRef = collection(db, "inspectionEngineerDemo");
//         const q = query(reportRef, where("email", "==", email));
//         const querySnapshot = await getDocs(q);

//         //  if querysnapshot does not exist then create a new document object
//         const timeStamp = new Date();

//         let leadObjWithTimeStamp = { ...leaObj, createdAt: timeStamp };

//         if (querySnapshot.empty) {
//             // create document

//             let obj = {
//                 name,
//                 email,
//                 inspections: [leadObjWithTimeStamp],
//                 // Add the server timestamp to createdAt field
//             };

//             const postRef = await addDoc(
//                 collection(db, "inspectionEngineerDemo", email),
//                 obj
//             );
//             return postRef.id; // Return the newly created document
//         } else {
//             let newInspections = [
//                 ...querySnapshot.docs[0].data().inspections,
//                 leadObjWithTimeStamp,
//             ];
//             // update document
//             const postRef = await updateDoc(querySnapshot.docs[0].ref, {
//                 inspections: newInspections,
//             });
//             return postRef;
//         }
//     } catch (error) {
//         console.error("Error updating inspection enginner lead: ", error);
//         throw error;
//     }
// };
export const updateLeadInEngineerDoc = async (leaObj, name, email) => {
    try {
        console.log("name is ", name, "email is ", email);
        const ref = collection(db, "inspectionEngineer");
        const q = query(ref, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        const doc = querySnapshot.docs[0];
        console.log("doc is: ", doc.data());

        const timeStamp = new Date();

        let leadObjWithTimeStamp = { ...leaObj, createdAt: timeStamp };

        let newInspections = [
            ...querySnapshot.docs[0].data().inspections,
            leadObjWithTimeStamp,
        ];
        // update document
        const postRef = await updateDoc(querySnapshot.docs[0].ref, {
            inspections: newInspections,
        });
        return postRef;
    } catch (error) {
        console.error("Error updating inspection enginner lead: ", error);
        throw error;
    }
};

export const deleteLeadOfInspectionEngineer = async (email, docID) => {
    try {
        const ref = collection(db, "inspectionEngineer");
        const q = query(ref, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        const doc = querySnapshot.docs[0];
        console.log("doc is: ", doc.data());

        let leadObjWithTimeStamp = { ...leaObj, createdAt: timeStamp };

        let newInspections = querySnapshot.docs[0]
            .data()
            .inspections.filter((doc) => {
                return doc.docID !== docID;
            });
        // update document
        const postRef = await updateDoc(querySnapshot.docs[0].ref, {
            inspections: newInspections,
        });
        return postRef;
    } catch (error) {
        console.error("Error updating inspection enginner lead: ", error);
        throw error;
    }
};

// ************************ IGNORE BELOW CODE *******************************

// function to upload document to firestore

// export const uploadDocumentToFirestore = async ({
//   name,
//   subject,
//   courseCode,
//   creator,
//   tags,
//   description,
//   selectedUnits,
//   fileUrl,

//   docType = "pdf",
//   downloads = 10,
//   likes = 10,
//   uploaderName = "temp uploader",
//   uploaderRef = "temp uploader ref",

// }) => {
//   console.log("doclinks inside uploading funciton", fileUrl)
//   try {
//     const docRef = await addDoc(collection(db, "resources"), {
//       docName: name,
//       creator,
//       docType,
//       downloads,
//       likes,
//       subject,
//       courseCode,
//       tags,
//       units: selectedUnits,
//       uploaderName,
//       uploaderRef,
//       creator,
//       description,
//       docLinks: fileUrl
//       // docLinks: ['url1', 'url2', 'url3'],

//     });
//     return docRef; // Return the ID of the newly created document
//   } catch (error) {
//     console.error("Error adding document: ", error);
//     throw error; // Handle the error as needed
//   }
// };

// // uploading file to firebase storage
// export const uploadFileToStorage = async (selectedFile) => {
//   // Create a storage reference with a unique name (e.g., a timestamp)
//   const storageRef = ref(
//     storage,
//     `resourceFiles/${selectedFile.name}`
//   );

//   try {
//     // Upload the selected file to Firebase Storage
//     const snapshot = await uploadBytes(storageRef, selectedFile);
//     console.log("Uploaded a file:", snapshot.metadata.name);

//     // Get the download URL of the uploaded file
//     const downloadURL = await getDownloadURL(storageRef);

//     return downloadURL; // Resolve the Promise with the download URL
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     setIsUploaded(true);
//     throw error; // Reject the Promise if there's an error
//   }
// };

// ******************************** from gdsc project *******************************************

// getting user with given email and getting user document id
// export const getUser = async (email) => {
//   try {

//       const usersRef = collection(db, 'users');
//       const q = query(usersRef, where("email", "==", email));
//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.empty) {
//           console.log("user does not exist")
//           return null;
//       }
//       else {
//           console.log("user doc is: " + querySnapshot.docs[0])
//           return querySnapshot.docs[0]
//       }
//   } catch (error) {
//       console.log("error getting user", error)
//       throw error;
//   }
// }

// // function to add a new user to firestore
// export const addUser = async ({
//   name, email, photoUrl

// }) => {
//   try {

//       const usersRef = collection(db, 'users');
//       const q = query(usersRef, where("email", "==", email));
//       const querySnapshot = await getDocs(q);
//       if (querySnapshot.empty) {
//           const newUser = {
//               name, email, photoUrl, anonymouseName: ""
//           }
//           console.log("query snap shot is ", querySnapshot)
//           const userRef = await addDoc(collection(db, "users"), newUser);
//           console.log('new user created with id: ', userRef.id)
//           return userRef; // Return the ID of the newly created document
//       } else {
//           console.log("user already exists")
//           return querySnapshot.docs[0]
//       }

//   } catch (error) {
//       console.error("Error creating user: ", error);
//       throw error; // Handle the error as needed
//   }
// };

// // update user
// export const updateUser = async (email, fieldsToUpdate) => {
//   try {
//       // Query Firestore to find the user document with the specified email
//       const usersRef = collection(db, 'users');
//       const q = query(usersRef, where('email', '==', email));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//           // If a user with the specified email exists, update their fields
//           const userId = querySnapshot.docs[0].id;
//           const userRef = doc(db, 'users', userId);

//           // Use the updateDoc method to update specific fields of the user document
//           await updateDoc(userRef, fieldsToUpdate);

//           console.log('User updated successfully');
//       } else {
//           console.log('User not found');
//       }
//   } catch (error) {
//       console.error('Error updating user: ', error);
//       throw error;
//   }
// };

// export const fetchAllPosts = async () => {

//   try {
//       const postData = [];
//       const postRef = collection(db, 'posts');
//       const querySnapshot = await getDocs(postRef);

//       querySnapshot.forEach((post) => {
//           postData.push({ id: post.id, ...post.data() });
//       });

//       return postData;
//   } catch (error) {
//       console.error('Error fetching posts...: ', error);
//       return [];
//   }
// };

// // Function to fetch one post from Firestore
// export const fetchOnePost = async (postId) => {
//   try {

//       const postRef = doc(db, 'posts', postId);

//       const postSnapshot = await getDoc(postRef);

//       if (postSnapshot.exists()) {
//           return { id: postSnapshot.id, ...postSnapshot.data() };
//       } else {

//           return null;
//       }
//   } catch (error) {
//       console.error('Error fetching post by ID: ', error);
//       return null; // You can handle errors appropriately in your application
//   }x
// };

// // function to upload document to firestore
// export const createPost = async ({
//   title,
//   description,
//   name,
//   email,

// }) => {

//   // getting user with given email
//   const userDoc = await getUser(email);

//   const postObj = {
//       title,
//       description,
//       likes: 0,
//       likedBy: [],
//       comments: 0,
//       uploaderName: name,
//       uploaderRef: userDoc.id,
//       commentsRef: "",
//       createdOn: formatDate(new Date()),

//   }
//   try {
//       const postRef = await addDoc(collection(db, "posts"), postObj);
//       return postRef; // Return the newly created document
//   } catch (error) {
//       console.error("Error creating rant: ", error);
//       throw error; // Handle the error as needed
//   }
// };

// // function to create or update comments
// export const addComment = async (postId, commentsRef, commentData) => {

//   // first check if comment section is available for given post
//   if (commentsRef) {
//       try {
//           const commentDoc = await getDoc(doc(db, "comments", commentsRef));
//           if (commentDoc.exists()) {
//               // If the document exists, update it by adding the new comment to the commentArray
//               const updatedCommentArray = [...commentDoc.data().commentArray, commentData];

//               await setDoc(doc(db, "comments", commentsRef), {
//                   commentArray: updatedCommentArray
//               }, { merge: true });

//               console.log('new comment updated with id: ', commentDoc.id)
//               return updatedCommentArray;
//           }

//       } catch (error) {
//           console.log("error updating new comment...", error)
//           throw error;
//       }
//   } else {
//       // if comment section does not exists
//       try {
//           // create a new comment section for given post
//           commentsRef = await addDoc(collection(db, 'comments'), {
//               commentArray: [
//                   commentData
//               ],
//               postRef: postId
//           })
//           console.log("commentsRef id is : ", commentsRef.id)
//           // setting the comment section id in post document
//           await setDoc(doc(db, "posts", postId), {
//               commentsRef: commentsRef.id
//           }, { merge: true });

//           console.log('new comment created with id: ', + commentsRef)
//           return commentsRef
//       } catch (error) {
//           console.log("error creating new comment...", error)
//           throw error;
//       }
//   }
// }

// //function to fetch all comments for a given post (with commentsRef)
// export const fetchPostComments = async (commentsRef) => {
//   try {

//       const postSnapshot = await getDoc(doc(db, 'comments', commentsRef));

//       return { id: postSnapshot.id, ...postSnapshot.data() };

//   } catch (error) {
//       console.error('Error fetching comments...: ', error);
//       return [];
//   }
// }

// // adding likes
// export const addLike = async (postId, email) => {
//   // first checking if the user has already liked the post
//   // we will check if the user's ID is present in the likedBy array field of the post document
//   console.log("post id is ", postId);
//   console.log("email is ", email);

//   try {
//       const postRef = doc(db, 'posts', postId);
//       const postSnapshot = await getDoc(postRef);

//       const userDoc = await getUser(email);
//       const userId = userDoc.id;

//       if (postSnapshot.exists()) {
//           const likedBy = postSnapshot.data().likedBy;
//           if (!(likedBy.includes(userId))) {
//               // if the user has not liked the post, add the like and increment the "likes" field of the post document
//               const updatedLikedBy = [...likedBy, userId];
//               const currentLikes = postSnapshot.data().likes; // Get the current number of likes
//               await setDoc(doc(db, "posts", postId), {
//                   likedBy: updatedLikedBy,
//                   likes: currentLikes + 1 // Increment the likes field
//               }, { merge: true });

//               console.log('new like added with id: ', postSnapshot.id)
//               return 1;
//           }
//       } else {
//           console.log('post does not exist')
//           return 0;
//       }
//   } catch (error) {
//       console.log("error adding like...", error);
//       throw error;
//   }
// }

// export const updateVisitorCount = async ()=>{
//   const visitorsDocID = process.env.NEXT_PUBLIC_VISITORS_DOC_ID
//   try{
//       const visitorDocRef = doc(db, 'visitors', visitorsDocID);
//       const visitorSnapshot = await getDoc(visitorDocRef);
//       const oldCount = visitorSnapshot.data().visitors;
//       const newCount = oldCount + 1;
//       const res = await updateDoc(visitorDocRef, {visitors: newCount});
//       console.log("visitor count updated successfully",res);
//       return newCount;
//   }catch(error){
//       console.log("error getting visitor count...", error);
//       throw error;
//   }
// }

// export const getVisitorCount = async ()=>{
//   const visitorsDocID = process.env.NEXT_PUBLIC_VISITORS_DOC_ID
//   try{
//       const visitorDocRef = doc(db, 'visitors', visitorsDocID);
//       const visitorSnapshot = await getDoc(visitorDocRef);
//       return visitorSnapshot.data().visitors;
//   }catch(error){
//       console.log("error getting visitor count...", error);
//       throw error;
//   }
// }
