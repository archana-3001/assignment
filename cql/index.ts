import path from 'path';
import fs from 'fs';

function readCql(cql) {
  return fs.readFileSync(path.join(__dirname, `${cql}.cql`), 'utf8');
}

export const KEYSPACE = readCql('keyspace');
export const MIGRATE = readCql('migrate')
  .split(';')
  .map(s => s.trim())
  .filter(s => s);
