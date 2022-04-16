export default function studioSet(bookshelf){
    const studioSet = bookshelf.Model.extend({
        idAttribute:'id',
        tableName:'animevrainz.studio_set',
        studios(){
            return this.belongsToMany('Studio','studio_set_studio','set_id','studio_id')
        }

    })
    return bookshelf.model('studioSet',studioSet);
}