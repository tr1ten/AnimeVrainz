BEGIN;
CREATE TYPE animevrainz.gender AS ENUM (
    'MALE',
    'FEMALE'
);

CREATE TABLE animevrainz.gender (
    label TEXT NOT NULL,
    id SERIAL PRIMARY KEY
);

CREATE TABLE animevrainz.anime (
    id SERIAL PRIMARY KEY,
    aired DATE NOT NULL DEFAULT CURRENT_DATE,
    studio_set_id INT NOT NULL,
    synopsis TEXT NOT NULL,
    episodes_count INT NOT NULL DEFAULT 12 CHECK(episodes_count > 0), 
    title TEXT NOT NULL,
    sequel_id INT,
    prequel_id INT,
    character_set_id INT
);

ALTER TABLE animevrainz.anime ADD COLUMN cover_art_id INT NOT NULL;
ALTER TABLE animevrainz.anime ADD FOREIGN KEY(cover_art_id) REFERENCES animevrainz.anime_cover_art (id);

CREATE TABLE animevrainz.anime_cover_art( 
    id SERIAL PRIMARY KEY,
    image_url VARCHAR DEFAULT 'https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png'
);

ALTER TABLE animevrainz.anime ADD FOREIGN KEY (sequel_id) REFERENCES animevrainz.anime (id);
ALTER TABLE animevrainz.anime ADD FOREIGN KEY (prequel_id) REFERENCES animevrainz.anime (id);

CREATE TABLE animevrainz.studio (
    id SERIAL PRIMARY KEY,
    established_at DATE NOT NULL,
    anime_set_id INT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE animevrainz.studio_set (
    id SERIAL PRIMARY KEY
);

CREATE TABLE animevrainz.studio_set_studio (
    set_id INT NOT NULL,
    studio_id INT NOT NULL
);

ALTER TABLE animevrainz.studio_set_studio ADD FOREIGN KEY (studio_id) REFERENCES animevrainz.studio(id);
ALTER TABLE animevrainz.studio_set_studio ADD FOREIGN KEY (set_id) REFERENCES animevrainz.studio_set(id);
ALTER TABLE animevrainz.anime ADD FOREIGN KEY (studio_set_id) REFERENCES animevrainz.studio_set(id);



CREATE TABLE animevrainz.anime_set_anime (
    anime_set_id INT NOT NULL,
    anime_id INT NOT NULL
);

ALTER TABLE animevrainz.anime_set_anime ADD PRIMARY KEY (anime_set_id,anime_id);
CREATE TABLE animevrainz.anime_set (
    id SERIAL PRIMARY KEY
)

ALTER TABLE animevrainz.anime_set_anime ADD FOREIGN KEY (anime_set_id) REFERENCES animevrainz.anime_set(id);
ALTER TABLE animevrainz.anime_set_anime ADD FOREIGN KEY (anime_id) REFERENCES animevrainz.anime(id);


ALTER TABLE animevrainz.studio ADD FOREIGN KEY (id) REFERENCES animevrainz.anime_set(id) DEFERRABLE INITIALLY DEFERRED; 

CREATE TABLE animevrainz.user (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    anime_set_id INT NOT NULL,
    gender_id INT NOT NULL

);

ALTER TABLE animevrainz.user ADD FOREIGN KEY (gender_id) REFERENCES animevrainz.gender(id) DEFERRABLE ;
ALTER TABLE animevrainz.user ADD FOREIGN KEY (anime_set_id) REFERENCES animevrainz.anime_set(id);


COMMIT;