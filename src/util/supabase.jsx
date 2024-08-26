import { createClient } from "@supabase/supabase-js";

import config from "../../config.json";

export const supabase = createClient(
  config.database.url,
  config.database.anon_key
);
