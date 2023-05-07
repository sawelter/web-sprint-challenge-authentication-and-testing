/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {username: 'bakugo', password: '$2a$08$tDSH.ddm2UBBVZTo3Fjlv.L3CiG0NsgOXn5dYj38IyQolYe/BKZHa'},
    {username: 'todoroki', password: '$2a$08$9WULnBG.X7mlK.SUU2411.YRlK0Gfxxwplc7UxQs8x4SDIE6rJEmC'},
    {username: 'yaorozu', password: '$2a$08$hJTucCYo.nfqbrcbInERmut3/8fVmVwEh97aNS7N/BLcVtMLtPeu2'}
  ]);
};
