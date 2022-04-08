export default function animeSet(bookshelf){
    const AnimeSet = bookshelf.Model.extend({
        idAttribute:'id',
        tableName:'animevrainz.anime_set',
        animes(){
            return this.belongsToMany('Anime','anime_set_anime','anime_set_id','anime_id')
        }

    })
    return bookshelf.model('AnimeSet',AnimeSet);
}