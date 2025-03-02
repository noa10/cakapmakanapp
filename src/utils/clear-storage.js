// Utility to clear local storage and session storage in the browser
// Run this in your browser console when testing your application

function clearBrowserStorage() {
  try {
    // Clear localStorage
    localStorage.clear();
    console.log('localStorage cleared successfully');
    
    // Clear sessionStorage
    sessionStorage.clear();
    console.log('sessionStorage cleared successfully');
    
    // Clear indexedDB (if used)
    const databases = indexedDB.databases ? indexedDB.databases() : Promise.resolve([]);
    databases.then((dbs) => {
      dbs.forEach((db) => {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
          console.log(`indexedDB database "${db.name}" deletion requested`);
        }
      });
    }).catch(err => {
      console.error('Error clearing indexedDB:', err);
    });
  } catch (error) {
    console.error('Error clearing browser storage:', error);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { clearBrowserStorage };
} 

// For browser console usage, uncomment the line below
// clearBrowserStorage(); 