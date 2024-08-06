const getAllShelves = 'SELECT shelf_id, name FROM Shelves WHERE user_id=$1';
const getBooksFromShelf = 'SELECT book_id FROM Book_Shelves WHERE shelf_id=$1';
const createShelf = 'INSERT INTO Shelves(user_id, name) VALUES($1, $2)';
const addBookToShelf = 'INSERT INTO Book_Shelves(book_id, shelf_id) VALUES($1, $2)';
const deleteShelf_1 = 'DELETE FROM Book_Shelves WHERE shelf_id=$1';
const deleteShelf_2 = 'DELETE FROM Shelves WHERE shelf_id=$1';
const removeBookFromShelf = 'DELETE FROM Book_Shelves WHERE shelf_id=$1 AND book_id=$2';
const checkShelfBelongs = 'SELECT shelf_id FROM Shelves WHERE shelf_id=$1 AND user_id=$2';
const checkShelfExists = 'SELECT shelf_id FROM Shelves WHERE name=$1';
const checkBookInShelf = 'SELECT * FROM Book_Shelves WHERE book_id=$1 AND shelf_id=$2';
const getStatusShelves = "SELECT name, shelf_id FROM Shelves WHERE (name='Want to Read' OR name='Reading' or name='Finished Reading') AND user_id=$1";

module.exports = {
    getAllShelves, 
    getBooksFromShelf,
    createShelf,
    addBookToShelf,
    deleteShelf_1,
    deleteShelf_2,
    removeBookFromShelf,
    checkShelfBelongs,
    checkShelfExists,
    checkBookInShelf,
    getStatusShelves	
}
