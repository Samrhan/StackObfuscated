PGDMP                     	    x           stackobfuscated    13.0    13.0 )    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16394    stackobfuscated    DATABASE     k   CREATE DATABASE stackobfuscated WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'French_France.1252';
    DROP DATABASE stackobfuscated;
                postgres    false            �            1259    16408    notes    TABLE     �   CREATE TABLE public.notes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    note integer NOT NULL,
    target_user integer NOT NULL,
    comment text
);
    DROP TABLE public.notes;
       public         heap    postgres    false            �            1259    16406    notes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.notes_id_seq;
       public          postgres    false    203            �           0    0    notes_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;
          public          postgres    false    202            �            1259    16439    post_tag    TABLE     \   CREATE TABLE public.post_tag (
    post_id integer NOT NULL,
    tag_id integer NOT NULL
);
    DROP TABLE public.post_tag;
       public         heap    postgres    false            �            1259    16419    posts    TABLE     �   CREATE TABLE public.posts (
    id integer NOT NULL,
    name text NOT NULL,
    body text NOT NULL,
    created_at date NOT NULL,
    user_id integer NOT NULL,
    votes integer NOT NULL
);
    DROP TABLE public.posts;
       public         heap    postgres    false            �            1259    16417    posts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.posts_id_seq;
       public          postgres    false    205            �           0    0    posts_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;
          public          postgres    false    204            �            1259    16430    replies    TABLE     �   CREATE TABLE public.replies (
    id integer NOT NULL,
    body text NOT NULL,
    votes integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at date NOT NULL
);
    DROP TABLE public.replies;
       public         heap    postgres    false            �            1259    16428    replies_id_seq    SEQUENCE     �   CREATE SEQUENCE public.replies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.replies_id_seq;
       public          postgres    false    207            �           0    0    replies_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.replies_id_seq OWNED BY public.replies.id;
          public          postgres    false    206            �            1259    16444    tags    TABLE     N   CREATE TABLE public.tags (
    id integer NOT NULL,
    name text NOT NULL
);
    DROP TABLE public.tags;
       public         heap    postgres    false            �            1259    16442    tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.tags_id_seq;
       public          postgres    false    210            �           0    0    tags_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;
          public          postgres    false    209            �            1259    16397    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    mail text NOT NULL,
    password text NOT NULL,
    username text NOT NULL,
    note integer NOT NULL,
    privileges integer NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16395    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    201            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    200            D           2604    16411    notes id    DEFAULT     d   ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);
 7   ALTER TABLE public.notes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    202    203            E           2604    16422    posts id    DEFAULT     d   ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);
 7   ALTER TABLE public.posts ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    205    204    205            F           2604    16433 
   replies id    DEFAULT     h   ALTER TABLE ONLY public.replies ALTER COLUMN id SET DEFAULT nextval('public.replies_id_seq'::regclass);
 9   ALTER TABLE public.replies ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    207    206    207            G           2604    16447    tags id    DEFAULT     b   ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);
 6   ALTER TABLE public.tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    210    210            C           2604    16400    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    200    201    201            �          0    16408    notes 
   TABLE DATA           H   COPY public.notes (id, user_id, note, target_user, comment) FROM stdin;
    public          postgres    false    203   ')       �          0    16439    post_tag 
   TABLE DATA           3   COPY public.post_tag (post_id, tag_id) FROM stdin;
    public          postgres    false    208   D)       �          0    16419    posts 
   TABLE DATA           K   COPY public.posts (id, name, body, created_at, user_id, votes) FROM stdin;
    public          postgres    false    205   a)       �          0    16430    replies 
   TABLE DATA           P   COPY public.replies (id, body, votes, post_id, user_id, created_at) FROM stdin;
    public          postgres    false    207   ~)       �          0    16444    tags 
   TABLE DATA           (   COPY public.tags (id, name) FROM stdin;
    public          postgres    false    210   �)       �          0    16397    users 
   TABLE DATA           O   COPY public.users (id, mail, password, username, note, privileges) FROM stdin;
    public          postgres    false    201   �)       �           0    0    notes_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.notes_id_seq', 1, false);
          public          postgres    false    202            �           0    0    posts_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.posts_id_seq', 1, false);
          public          postgres    false    204            �           0    0    replies_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.replies_id_seq', 1, false);
          public          postgres    false    206            �           0    0    tags_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.tags_id_seq', 1, false);
          public          postgres    false    209            �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
          public          postgres    false    200            K           2606    16416    notes notes_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.notes DROP CONSTRAINT notes_pkey;
       public            postgres    false    203            M           2606    16427    posts posts_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
       public            postgres    false    205            O           2606    16438    replies replies_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.replies
    ADD CONSTRAINT replies_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.replies DROP CONSTRAINT replies_pkey;
       public            postgres    false    207            Q           2606    16452    tags tags_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_pkey;
       public            postgres    false    210            I           2606    16405    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    201            �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �     