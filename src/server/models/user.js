export default function user(bookshelf){
    const User = bookshelf.Model.extend({
        idAttribute:'id',
        animeSet(){
            return this.belongsTo('AnimeSet','anime_set_id');
        },
        gender(){
            return this.belongsTo('Gender','gender_id');
        },
        tableName:'animevrainz.user'

    })
    return bookshelf.model('User',User);
}