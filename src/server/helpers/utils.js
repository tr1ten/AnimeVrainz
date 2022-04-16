// import { Anime } from "../../common/type";
export async function processAnime(anime, orm, transacting) {
  const { aired, episodes_count, studios, title, synopsis, image_url } = anime;
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
  if (parseInt(animeSetId)) {
    const studioSetId = await processStudioSet(
      studios,
      animeSetId,
      orm,
      transacting
    );

    canime.set({ studio_set_id: studioSetId });
  }
  const animeCoverArtId = await processCoverArt(image_url, orm, transacting);
  if (animeCoverArtId) {
    canime.set({ cover_art_id: animeCoverArtId });
  }

  await canime.save(null, { transacting });
  return;
}

async function processStudioSet(studios, animeSetId, orm, transacting) {
  const { Studio, StudioSet } = orm;
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
          established_at: studio.establishedAt ?? new Date(),
        }).save(null, { transacting });
        id = studioNew.get("id");
      } else {
        id = studioNew.get("id");
      }
      allIds.push(id);
    } catch (err) {}
  }
  try {
    const studioSet = await createNewSetWithItems(
      orm,
      StudioSet,
      "studios",
      allIds,
      transacting
    );
    return studioSet.get("id");
  } catch (err) {
    console.log("error while creating set ", err);
  }
}

export async function processCoverArt(imgUrl, orm, transacting) {
  const { AnimeCoverArt } = orm;
  try {
    const coverArt = await new AnimeCoverArt({ image_url: imgUrl }).save(null, {
      transacting,
    });
    return coverArt.get("id");
  } catch (err) {
    console.log("error while creating anime covert art id");
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
    throw Error("itemsAttribute must be set in createNewSetWithItems ");
  }
  const newSet = await new SetModel().save(null, { transacting });
  try {
    const newSetItemsCollection = await newSet
      .related(itemsAttribute)
      .fetch({ require: false, transacting });
    const newSetItemsCollectionAttached = await newSetItemsCollection?.attach(
      ids,
      { transacting }
    );
  } catch (err) {
    console.log("error while attching", err);
  }

  return newSet;
}
