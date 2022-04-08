export default function gender(bookshelf){
    const Gender = bookshelf.Model.extend({
        idAttribute:'id',
        tableName:'animevrainz.gender'

    })
    return bookshelf.model('Gender',Gender);
}