create table if not exists settings (
  key text primary key,
  value text not null
);

create table if not exists institutions (
  id text primary key,
  name text not null unique,
  pin_hash text not null,
  weekly_spell_limit integer not null default 1,
  per_school_limit integer not null default 0,
  is_antagonist boolean not null default false,
  advancement_min integer not null default 1
);

create table if not exists institution_subjects (
  institution_id text not null references institutions (id) on delete cascade,
  school text not null,
  primary key (institution_id, school)
);

create table if not exists catalog_tiers (
  level integer primary key
);

create table if not exists catalog_spells (
  id text primary key,
  name text not null,
  school text not null,
  tier integer not null,
  form_id text not null default '',
  hidden boolean not null default false
);

create table if not exists catalog_perks (
  id text primary key,
  school text not null,
  rank text not null,
  form_id text not null default '',
  unlock text not null default '',
  prohibited boolean not null default false
);

create table if not exists students (
  id text primary key,
  institution_id text not null references institutions (id),
  name text not null,
  status text not null default 'active',
  is_antagonist boolean not null default false,
  notes text not null default '',
  last_lesson_date date,
  last_institution_id text,
  last_subject text not null default '',
  specialization_school text not null default '',
  created_at timestamptz not null default now()
);

create unique index if not exists students_name_lower_idx on students (lower(name));

create table if not exists student_access (
  student_id text not null references students (id) on delete cascade,
  institution_id text not null references institutions (id) on delete cascade,
  primary key (student_id, institution_id)
);

create table if not exists lessons (
  id text primary key,
  student_id text not null references students (id) on delete cascade,
  date date not null,
  institution_id text not null references institutions (id),
  subject text not null default '',
  teacher_name text not null default '',
  notes text not null default ''
);

create table if not exists learned_spells (
  id text primary key,
  student_id text not null references students (id) on delete cascade,
  lesson_id text,
  catalog_id text not null default '',
  name text not null,
  school text not null,
  tier integer not null default 1,
  form_id text not null default '',
  institution_id text not null references institutions (id),
  status text not null default 'pending',
  taught_date date not null,
  granted_date date
);

create table if not exists student_tiers (
  student_id text not null references students (id) on delete cascade,
  institution_id text not null references institutions (id),
  school text not null,
  level integer not null,
  primary key (student_id, institution_id, school)
);

create table if not exists student_progress (
  student_id text not null references students (id) on delete cascade,
  institution_id text not null references institutions (id),
  school text not null,
  learnable_tier integer not null default 1,
  primary key (student_id, institution_id, school)
);

create table if not exists granted_perks (
  id text primary key,
  student_id text not null references students (id) on delete cascade,
  catalog_id text not null default '',
  school text not null,
  rank text not null,
  form_id text not null default '',
  granted_date date not null
);
