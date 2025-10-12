// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from './0000_jittery_marrow.sql';
import m0001 from './0001_burly_toad.sql';
import m0002 from './0002_boring_shape.sql';
import journal from './meta/_journal.json';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002
    }
  }
  