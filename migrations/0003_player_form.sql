alter table students add column if not exists form_id text not null default '';

create unique index if not exists students_form_id_uidx
  on students (lower(form_id))
  where form_id <> '';

drop index if exists students_name_lower_idx;

alter table student_access add column if not exists display_name text not null default '';
alter table student_access add column if not exists enrolled_at timestamptz not null default now();
