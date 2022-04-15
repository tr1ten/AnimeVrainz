// import { Anime } from "../../common/type";
export async function processAnime(anime, orm, transacting) {
  const { aired, episodes_count, studios, title, synopsis } = anime;
  const { Anime } = orm;
  const canime = await Anime.forge().save(
    {
      aired,
      synopsis,
      episodes_count: parseInt(episodes_count),
      title,
    },
    { transacting }
  );
  const animeSetId = await processAnimeSet(
    [canime.get("id")],
    orm,
    transacting
  );
  console.log("here animeSet id ", animeSetId);
  if (parseInt(animeSetId)) {
    const studioSetId = await processStudioSet(
      studios,
      animeSetId,
      orm,
      transacting
    );
    canime.set({ studio_set_id: studioSetId });
  }

  await canime.save(null, { transacting });
  console.log("returning transaction");
  return;
}

async function processStudioSet(studios, animeSetId, orm, transacting) {
  const { Studio, StudioSet } = orm;
  console.log("here studios", studios);
  const allIds = [];
  for (const studio of studios) {
    try {
      let studioNew = await new Studio({ name: studio.name }).fetch({
        require: false,
        transacting,
      });
      const isNew = !studioNew;
      let id;
      if (isNew) {
        studioNew = await new Studio({
          name: studio.name,
          anime_set_id: animeSetId,
          established_at: studio.establishedAt ?? new Date()
        }).save(null, { transacting });;

        // if (studio.establishedAt) {
        //   studioNew.set("established_at", studio.establishedAt);
        // } else {
        //   studioNew.set("established_at", new Date());
        // }
        console.log("here appending id new", studioNew.toJSON());
        id = studioNew.get("id");
      } else {
        id = studioNew.get("id");
      }
      allIds.push(id);
    } catch (err) {
      console.log("error while adding studio ", err);
    }
  }
  try {
    const studioSet = await createNewSetWithItems(
      orm,
      StudioSet,
      "studios",
      allIds,
      transacting
    );
    console.log("returning id from ss");
    return studioSet.get("id");
  } catch (err) {
    console.log("error while creating set ", err);
  }
}

export async function processAnimeSet(ids, orm, transacting) {
  const { AnimeSet } = orm;
  try {
    const animeSet = await createNewSetWithItems(
      orm,
      AnimeSet,
      "animes",
      ids,
      transacting
    );
    return animeSet.get("id");
  } catch (err) {
    console.log("error while animeeset ", err);
  }
}
export async function createNewSetWithItems(
  orm,
  SetModel,
  itemsAttribute,
  ids,
  transacting
) {
  if (!itemsAttribute || !ids?.length) {
    console.log("not error", itemsAttribute, ids);
    throw Error("itemsAttribute must be set in createNewSetWithItems ");
  }
  const newSet = await new SetModel().save(null, { transacting });
  console.log("here ids", ids, itemsAttribute);
  try {
    const newSetItemsCollection = await newSet
      .related(itemsAttribute)
      .fetch({ require: false, debug: true, transacting });
    const newSetItemsCollectionAttached = await newSetItemsCollection?.attach(
      ids,
      { transacting }
    );
  } catch (err) {
    console.log("error while attching", err);
  }

  return newSet;
}
