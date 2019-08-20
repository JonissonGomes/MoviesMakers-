drop database if exists moviesmakers;
create database if not exists moviesmakers;

use moviesmakers;

-- UP
create table users (
    id          int primary key auto_increment,
    name        varchar(255),
    email       varchar(255),
    password    varchar(255)
);

create table movies (
    id       int primary key auto_increment,
    name     varchar(255),
    genre    varchar(255),
    year     int,
    duration int,
    synopsis text,
    director varchar(255)
);

create table users_movies (
    user_id  int,
    movie_id int,
    watched  boolean,
    grade    int,
    primary key (user_id, movie_id),
    foreign key (user_id) references users(id),
    foreign key (movie_id) references movies(id)
);

-- ENDUP

create user if not exists mm_admin identified by 'mm_admin'; -- cria super usuario mm_admin 
grant all privileges on moviesmakers.* to mm_admin;

-- SEED
insert into users (name, email, password) values
    ('Tony Stark', 'tony@stark.co', 'pepper'),
    ('Bruce Banner', 'bruce@avengers.com', 'natasha'),
    ('Bruce Wayne', 'bruce@wayne.tech', 'alfred');

insert into movies (name, genre, year, duration, synopsis, director) values
    ('Iron Man', 'Action', 2008, 126, '...', 'Jon Favreau'),
    ('Avengers', 'Action', 2012, 160, '...', 'Joss Whedon'),
    ('Batman vs Superman', 'Action', 2016, 183, '...', 'Zack Snyder'),
    ('Ant Man', 'Action',  2015, 118, '...', 'Peyton Reed');

insert into users_movies (user_id, movie_id, watched, grade) values
    (1, 1, true, 10),
    (1, 2, true, 9),
    (1, 3, false, null),
    (2, 2, true, 8),
    (2, 3, false, null),
    (3, 3, true, 7);
