import { readdirSync } from 'fs';
let acc
readdirSync('frontend').forEach(f => {acc = acc + ' ' + f + ', '})
console.log(acc);