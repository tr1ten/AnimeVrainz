export default function anime(bookshelf){
    const Anime = bookshelf.Model.extend({
        idAttribute:'id',
        studioSet(){
            return this.belongsTo('StudioSet','studio_set_id');
        },
        sequel(){
            return this.belongsTo('Anime','sequel_id');
        },
        prequel(){
            return this.belongsTo('Anime','prequel_id');
        },
        coverArt(){
            return this.belongsTo('AnimeCoverArt','cover_art_id');
        },
        characterSet(){
            return this.belongsTo('CharacterSet','character_set_id');
        },
        tableName:'animevrainz.anime'


    })
    return bookshelf.model('Anime',Anime);
}