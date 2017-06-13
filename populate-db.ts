

import 'core-js/es6/reflect';
import 'core-js/es7/reflect';



import {database, initializeApp} from "firebase";
import {firebaseConfig} from "./src/environments/firebase.config";
import {dbData} from "./db-data";


console.log("WARNING VERY IMPORTANT - PLEASE READ THIS\n\n\n");
console.log('WARNING Please set your own firebase config on src/environmnents/firebase.config.ts');
console.log('Otherwise you will get permissions errors, because the populate-db script is trying to write to my database instead of yours. ');
console.log('Any issues please contact me, Thanks, Vasco\n\n\n');

const userKey = 'qznIxPwjCJbgyJYVzNqAsUV8T222';

initializeApp(firebaseConfig);

const mainusersRef = database().ref('users');
const usersRef = database().ref(`users/${userKey}`);
const accountsRef = database().ref('accounts');
const notesRef = database().ref('notes');
const quicknotesRef = database().ref('quicknotes');

// Gets reference to linking nodes
const accountsPerUserRef = database().ref('accountsPerUser');
const notesPerUserRef = database().ref('notesPerUser');
const quicknotesPerUserRef = database().ref('quicknotesPerUser');

mainusersRef.remove();
accountsRef.remove();
notesRef.remove();
quicknotesRef.remove();
accountsPerUserRef.remove();
notesPerUserRef.remove();
quicknotesPerUserRef.remove();

const currentTime = (new Date).getTime();

dbData.users.forEach( user => {

	console.log('adding user', user.first_name);

	const userRef = {key: userKey};

	usersRef.set({
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		first_time: user.first_time,
		date_created: currentTime,
		email_confirmed: user.email_confirmed
	});

	user.accounts.forEach((account: any) =>  {

		console.log('adding account ', account.website);

		const pushedAccountKey = accountsRef.push({
			login: account.login,
			website: account.website,
			password: account.password,
			date_created: currentTime
		}).key;

		// Gets reference to user node inside accountsPerUser
		const accountsPerUser = accountsPerUserRef.child(userRef.key);

		// Get the reference to the specific object with the account key
		// under the user node under accountsPerUser
		const accountUserAssociation = accountsPerUser.child(pushedAccountKey);

		// Set the value of that key to the website name.
		accountUserAssociation.set(account.website);

	});

	user.notes.forEach((note: any) =>  {

		console.log('adding note ', note.title);

		const pushedNoteKey = notesRef.push({
			title: note.title,
			body: note.body,
			date_created: currentTime
		}).key;

		// Gets reference to user node inside accountsPerUser
		const notesPerUser = notesPerUserRef.child(userRef.key);

		// Get the reference to the specific object with the account key
		// under the user node under accountsPerUser
		const noteUserAssociation = notesPerUser.child(pushedNoteKey);

		// Set the value of that key to the website name.
		noteUserAssociation.set(note.title);

	});

	user.quicknotes.forEach((quicknote: any) =>  {

		console.log('adding quicknote ', quicknote.title);

		const pushedQuicknoteKey = quicknotesRef.push({
			title: quicknote.title,
			body: quicknote.body,
			date_created: currentTime
		}).key;

		// Gets reference to user node inside accountsPerUser
		const quicknotesPerUser = quicknotesPerUserRef.child(userRef.key);

		// Get the reference to the specific object with the account key
		// under the user node under accountsPerUser
		const quicknoteUserAssociation = quicknotesPerUser.child(pushedQuicknoteKey);

		// Set the value of that key to the website name.
		quicknoteUserAssociation.set(quicknote.title);

	});


});




