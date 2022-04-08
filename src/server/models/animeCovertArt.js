export default function animeCoverArt(bookshelf){
    const AnimeCoverArt = bookshelf.Model.extend({
        idAttribute:'id',
        tableName:'anime_cover_art'

    })
    return bookshelf.model('AnimeCoverArt',AnimeCoverArt);
}