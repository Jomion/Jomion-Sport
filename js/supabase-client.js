/* =========================================================
   JOMION-SPORT — Connexion à Supabase
   =========================================================
   ÉTAPE OBLIGATOIRE avant que l'administration fonctionne :

   1. Allez dans votre projet Supabase → Project Settings → API.
   2. Copiez "Project URL" et collez-la ci-dessous à la place de
      SUPABASE_URL.
   3. Copiez la clé "anon public" et collez-la à la place de
      SUPABASE_ANON_KEY.

   Ces deux valeurs ne sont PAS secrètes : elles sont conçues
   pour être utilisées dans un site public, à condition que le
   Row Level Security (RLS) reste activé sur toutes les tables
   (c'est le cas avec le script SQL fourni). Ne mettez JAMAIS la
   clé "service_role" ici : elle est secrète et ne doit jamais
   apparaître dans un fichier public.
   ========================================================= */

const SUPABASE_URL = "https://meuqqcblvuutexewjlpq.supabase.co/rest/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldXFxY2JsdnV1dGV4ZXdqbHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3Mjc2MjYsImV4cCI6MjEwMjMwMzYyNn0.sXurXgIvY2Mdt_F-Ee3dLNn9suBYwkvyx0ub4maxY8w";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
