-- =========================================================
-- VIBECONNECT DATABASE FOUNDATION
-- STEP 21
----------

-- Run this file inside:
-- Supabase Dashboard → SQL Editor
----------------------------------

-- This creates the core tables for VibeConnect.
-- =========================================================

-- =========================================================
-- EXTENSIONS
-- =========================================================

create extension if not exists "pgcrypto";

-- =========================================================
-- PROFILES
-- =========================================================

create table if not exists public.profiles (

```
id uuid primary key
    references auth.users(id)
    on delete cascade,

display_name text,

username text unique,

bio text,

website text,

location text,

birthday date,

avatar_url text,

cover_url text,

created_at timestamptz
    default now(),

updated_at timestamptz
    default now()
```

);

-- =========================================================
-- POSTS
-- =========================================================

create table if not exists public.posts (

```
id uuid primary key
    default gen_random_uuid(),

user_id uuid not null
    references public.profiles(id)
    on delete cascade,

content text,

media_url text,

media_type text,

post_type text
    default 'text',

created_at timestamptz
    default now(),

updated_at timestamptz
    default now()
```

);

-- =========================================================
-- COMMENTS
-- =========================================================

create table if not exists public.comments (

```
id uuid primary key
    default gen_random_uuid(),

post_id uuid not null
    references public.posts(id)
    on delete cascade,

user_id uuid not null
    references public.profiles(id)
    on delete cascade,

content text not null,

created_at timestamptz
    default now(),

updated_at timestamptz
    default now()
```

);

-- =========================================================
-- LIKES
-- =========================================================

create table if not exists public.likes (

```
id uuid primary key
    default gen_random_uuid(),

post_id uuid not null
    references public.posts(id)
    on delete cascade,

user_id uuid not null
    references public.profiles(id)
    on delete cascade,

created_at timestamptz
    default now(),

unique(post_id, user_id)
```

);

-- =========================================================
-- FOLLOWS
-- =========================================================

create table if not exists public.follows (

```
id uuid primary key
    default gen_random_uuid(),

follower_id uuid not null
    references public.profiles(id)
    on delete cascade,

following_id uuid not null
    references public.profiles(id)
    on delete cascade,

created_at timestamptz
    default now(),

unique(follower_id, following_id),

check(follower_id <> following_id)
```

);

-- =========================================================
-- SAVED POSTS
-- =========================================================

create table if not exists public.saved_posts (

```
id uuid primary key
    default gen_random_uuid(),

user_id uuid not null
    references public.profiles(id)
    on delete cascade,

post_id uuid not null
    references public.posts(id)
    on delete cascade,

created_at timestamptz
    default now(),

unique(user_id, post_id)
```

);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================

create table if not exists public.notifications (

```
id uuid primary key
    default gen_random_uuid(),

user_id uuid not null
    references public.profiles(id)
    on delete cascade,

actor_id uuid
    references public.profiles(id)
    on delete cascade,

type text not null,

message text,

post_id uuid
    references public.posts(id)
    on delete cascade,

is_read boolean
    default false,

created_at timestamptz
    default now()
```

);

-- =========================================================
-- MESSAGES
-- =========================================================

create table if not exists public.messages (

```
id uuid primary key
    default gen_random_uuid(),

sender_id uuid not null
    references public.profiles(id)
    on delete cascade,

receiver_id uuid not null
    references public.profiles(id)
    on delete cascade,

content text not null,

is_read boolean
    default false,

created_at timestamptz
    default now()
```

);

-- =========================================================
-- STORIES
-- =========================================================

create table if not exists public.stories (

```
id uuid primary key
    default gen_random_uuid(),

user_id uuid not null
    references public.profiles(id)
    on delete cascade,

content text,

media_url text,

media_type text,

caption text,

expires_at timestamptz not null,

created_at timestamptz
    default now()
```

);

-- =========================================================
-- HASHTAGS
-- =========================================================

create table if not exists public.hashtags (

```
id uuid primary key
    default gen_random_uuid(),

name text unique not null,

description text,

category text,

created_at timestamptz
    default now()
```

);

-- =========================================================
-- POST HASHTAGS
-- =========================================================

create table if not exists public.post_hashtags (

```
id uuid primary key
    default gen_random_uuid(),

post_id uuid not null
    references public.posts(id)
    on delete cascade,

hashtag_id uuid not null
    references public.hashtags(id)
    on delete cascade,

unique(post_id, hashtag_id)
```

);

-- =========================================================
-- FOLLOWED HASHTAGS
-- =========================================================

create table if not exists public.hashtag_follows (

```
id uuid primary key
    default gen_random_uuid(),

user_id uuid not null
    references public.profiles(id)
    on delete cascade,

hashtag_id uuid not null
    references public.hashtags(id)
    on delete cascade,

created_at timestamptz
    default now(),

unique(user_id, hashtag_id)
```

);

-- =========================================================
-- INDEXES
-- =========================================================

create index if not exists
posts_user_id_idx
on public.posts(user_id);

create index if not exists
posts_created_at_idx
on public.posts(created_at desc);

create index if not exists
comments_post_id_idx
on public.comments(post_id);

create index if not exists
likes_post_id_idx
on public.likes(post_id);

create index if not exists
likes_user_id_idx
on public.likes(user_id);

create index if not exists
follows_follower_id_idx
on public.follows(follower_id);

create index if not exists
follows_following_id_idx
on public.follows(following_id);

create index if not exists
messages_sender_id_idx
on public.messages(sender_id);

create index if not exists
messages_receiver_id_idx
on public.messages(receiver_id);

create index if not exists
notifications_user_id_idx
on public.notifications(user_id);

create index if not exists
stories_user_id_idx
on public.stories(user_id);

create index if not exists
stories_expires_at_idx
on public.stories(expires_at);

-- =========================================================
-- UPDATED_AT FUNCTION
-- =========================================================

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin

```
new.updated_at = now();

return new;
```

end;

$$;


-- =========================================================
-- PROFILE TRIGGER
-- =========================================================

drop trigger if exists
profiles_updated_at
on public.profiles;


create trigger
profiles_updated_at

before update
on public.profiles

for each row

execute function
public.update_updated_at();


-- =========================================================
-- POST TRIGGER
-- =========================================================

drop trigger if exists
posts_updated_at
on public.posts;


create trigger
posts_updated_at

before update
on public.posts

for each row

execute function
public.update_updated_at();


-- =========================================================
-- COMMENT TRIGGER
-- =========================================================

drop trigger if exists
comments_updated_at
on public.comments;


create trigger
comments_updated_at

before update
on public.comments

for each row

execute function
public.update_updated_at();


-- =========================================================
-- ENABLE ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles
enable row level security;

alter table public.posts
enable row level security;

alter table public.comments
enable row level security;

alter table public.likes
enable row level security;

alter table public.follows
enable row level security;

alter table public.saved_posts
enable row level security;

alter table public.notifications
enable row level security;

alter table public.messages
enable row level security;

alter table public.stories
enable row level security;

alter table public.hashtags
enable row level security;

alter table public.post_hashtags
enable row level security;

alter table public.hashtag_follows
enable row level security;


-- =========================================================
-- PROFILE POLICIES
-- =========================================================

drop policy if exists
"profiles_select_authenticated"
on public.profiles;


create policy
"profiles_select_authenticated"

on public.profiles

for select

to authenticated

using (true);


drop policy if exists
"profiles_insert_own"
on public.profiles;


create policy
"profiles_insert_own"

on public.profiles

for insert

to authenticated

with check (
    auth.uid() = id
);


drop policy if exists
"profiles_update_own"
on public.profiles;


create policy
"profiles_update_own"

on public.profiles

for update

to authenticated

using (
    auth.uid() = id
)

with check (
    auth.uid() = id
);


-- =========================================================
-- POSTS POLICIES
-- =========================================================

drop policy if exists
"posts_select_authenticated"
on public.posts;


create policy
"posts_select_authenticated"

on public.posts

for select

to authenticated

using (true);


drop policy if exists
"posts_insert_own"
on public.posts;


create policy
"posts_insert_own"

on public.posts

for insert

to authenticated

with check (
    auth.uid() = user_id
);


drop policy if exists
"posts_update_own"
on public.posts;


create policy
"posts_update_own"

on public.posts

for update

to authenticated

using (
    auth.uid() = user_id
)

with check (
    auth.uid() = user_id
);


drop policy if exists
"posts_delete_own"
on public.posts;


create policy
"posts_delete_own"

on public.posts

for delete

to authenticated

using (
    auth.uid() = user_id
);


-- =========================================================
-- COMMENTS POLICIES
-- =========================================================

drop policy if exists
"comments_select_authenticated"
on public.comments;


create policy
"comments_select_authenticated"

on public.comments

for select

to authenticated

using (true);


drop policy if exists
"comments_insert_own"
on public.comments;


create policy
"comments_insert_own"

on public.comments

for insert

to authenticated

with check (
    auth.uid() = user_id
);


drop policy if exists
"comments_delete_own"
on public.comments;


create policy
"comments_delete_own"

on public.comments

for delete

to authenticated

using (
    auth.uid() = user_id
);


-- =========================================================
-- LIKES POLICIES
-- =========================================================

drop policy if exists
"likes_select_authenticated"
on public.likes;


create policy
"likes_select_authenticated"

on public.likes

for select

to authenticated

using (true);


drop policy if exists
"likes_insert_own"
on public.likes;


create policy
"likes_insert_own"

on public.likes

for insert

to authenticated

with check (
    auth.uid() = user_id
);


drop policy if exists
"likes_delete_own"
on public.likes;


create policy
"likes_delete_own"

on public.likes

for delete

to authenticated

using (
    auth.uid() = user_id
);


-- =========================================================
-- FOLLOWS POLICIES
-- =========================================================

drop policy if exists
"follows_select_authenticated"
on public.follows;


create policy
"follows_select_authenticated"

on public.follows

for select

to authenticated

using (true);


drop policy if exists
"follows_insert_own"
on public.follows;


create policy
"follows_insert_own"

on public.follows

for insert

to authenticated

with check (
    auth.uid() = follower_id
);


drop policy if exists
"follows_delete_own"
on public.follows;


create policy
"follows_delete_own"

on public.follows

for delete

to authenticated

using (
    auth.uid() = follower_id
);


-- =========================================================
-- SAVED POSTS POLICIES
-- =========================================================

drop policy if exists
"saved_select_own"
on public.saved_posts;


create policy
"saved_select_own"

on public.saved_posts

for select

to authenticated

using (
    auth.uid() = user_id
);


drop policy if exists
"saved_insert_own"
on public.saved_posts;


create policy
"saved_insert_own"

on public.saved_posts

for insert

to authenticated

with check (
    auth.uid() = user_id
);


drop policy if exists
"saved_delete_own"
on public.saved_posts;


create policy
"saved_delete_own"

on public.saved_posts

for delete

to authenticated

using (
    auth.uid() = user_id
);


-- =========================================================
-- NOTIFICATIONS POLICIES
-- =========================================================

drop policy if exists
"notifications_select_own"
on public.notifications;


create policy
"notifications_select_own"

on public.notifications

for select

to authenticated

using (
    auth.uid() = user_id
);


drop policy if exists
"notifications_update_own"
on public.notifications;


create policy
"notifications_update_own"

on public.notifications

for update

to authenticated

using (
    auth.uid() = user_id
)

with check (
    auth.uid() = user_id
);


-- =========================================================
-- MESSAGES POLICIES
-- =========================================================

drop policy if exists
"messages_select_participant"
on public.messages;


create policy
"messages_select_participant"

on public.messages

for select

to authenticated

using (
    auth.uid() = sender_id
    or
    auth.uid() = receiver_id
);


drop policy if exists
"messages_insert_sender"
on public.messages;


create policy
"messages_insert_sender"

on public.messages

for insert

to authenticated

with check (
    auth.uid() = sender_id
);


-- =========================================================
-- STORIES POLICIES
-- =========================================================

drop policy if exists
"stories_select_authenticated"
on public.stories;


create policy
"stories_select_authenticated"

on public.stories

for select

to authenticated

using (true);


drop policy if exists
"stories_insert_own"
on public.stories;


create policy
"stories_insert_own"

on public.stories

for insert

to authenticated

with check (
    auth.uid() = user_id
);


drop policy if exists
"stories_delete_own"
on public.stories;


create policy
"stories_delete_own"

on public.stories

for delete

to authenticated

using (
    auth.uid() = user_id
);


-- =========================================================
-- HASHTAGS POLICIES
-- =========================================================

drop policy if exists
"hashtags_select_authenticated"
on public.hashtags;


create policy
"hashtags_select_authenticated"

on public.hashtags

for select

to authenticated

using (true);


-- =========================================================
-- POST HASHTAGS POLICIES
-- =========================================================

drop policy if exists
"post_hashtags_select_authenticated"
on public.post_hashtags;


create policy
"post_hashtags_select_authenticated"

on public.post_hashtags

for select

to authenticated

using (true);


-- =========================================================
-- HASHTAG FOLLOWS POLICIES
-- =========================================================

drop policy if exists
"hashtag_follows_select_own"
on public.hashtag_follows;


create policy
"hashtag_follows_select_own"

on public.hashtag_follows

for select

to authenticated

using (
    auth.uid() = user_id
);


drop policy if exists
"hashtag_follows_insert_own"
on public.hashtag_follows;


create policy
"hashtag_follows_insert_own"

on public.hashtag_follows

for insert

to authenticated

with check (
    auth.uid() = user_id
);


drop policy if exists
"hashtag_follows_delete_own"
on public.hashtag_follows;


create policy
"hashtag_follows_delete_own"

on public.hashtag_follows

for delete

to authenticated

using (
    auth.uid() = user_id
);


-- =========================================================
-- DONE
-- =========================================================
-- VibeConnect database foundation created.
-- =========================================================
$$
