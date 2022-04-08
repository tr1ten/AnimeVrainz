export default function studio(bookshelf){
    const Studio = bookshelf.Model.extend({
        idAttribute:'id',
        animeSet(){
            return this.belongsTo('AnimeSet','anime_set_id');
        },
        tableName:'animevrainz.studio'

    })
    return bookshelf.model('Studio',Studio);
}