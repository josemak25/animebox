// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from './0000_messy_the_fallen.sql';
import m0001 from './0001_misty_veda.sql';
import journal from './meta/_journal.json';

  export default {
    journal,
    migrations: {
      m0000,
m0001
    }
  }
  