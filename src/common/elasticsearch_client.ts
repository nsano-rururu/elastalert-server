import elasticsearch5 from 'es5';
import elasticsearch6 from 'es6';
import elasticsearch7 from 'es7';
import opensearch from '@opensearch-project/opensearch';
//TODO: Elasticsearch 8.x
//import elasticsearch8 from 'es8';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'fs' or its corresponding type ... Remove this comment to see the full error message
import fs from 'fs';
import config from './config';
import axios from 'axios';

export function escapeLuceneSyntax(str: any) {
  return [].map
    .call(str, char => {
      if (
        char === '/' ||
        char === '+' ||
        char === '-' ||
        char === '&' ||
        char === '|' ||
        char === '!' ||
        char === '(' ||
        char === ')' ||
        char === '{' ||
        char === '}' ||
        char === '[' ||
        char === ']' ||
        char === '^' ||
        char === '"' ||
        char === '~' ||
        char === '*' ||
        char === '?' ||
        char === ':' ||
        char === '\\'
      ) {
        return `\\${char}`;
      }
      return char;
    })
    .join('');
}

export async function getClientVersion() {

  try {
    // OpenSearch 1.0
    if (config.get('opensearch_flg')) {
      return '7.10.2';
    }

    let scheme = 'http';

    if (config.get('es_ssl')) {
      scheme = 'https';
    }

    let auth = '';
    
    if (config.get('es_username') && config.get('es_password')) {
      auth = `${config.get('es_username')}:${config.get('es_password')}@`;
    }

    const agent  = {};

    if (config.get('es_ssl')) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'rejectUnauthorized' does not exist on ty... Remove this comment to see the full error message
      agent.rejectUnauthorized = config.get('ea_verify_certs');

      if (config.get('es_ca_certs')) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'ca' does not exist on type '{}'.
        agent.ca = fs.readFileSync(config.get('es_ca_certs'));
      }
      if (config.get('es_client_cert')) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'cert' does not exist on type '{}'.
        agent.cert = fs.readFileSync(config.get('es_client_cert'));
      }
      if (config.get('es_client_key')) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'key' does not exist on type '{}'.
        agent.key = fs.readFileSync(config.get('es_client_key'));
      }
    }

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const https = require('https');
    const httpsAgent = new https.Agent(agent);
    const result = 
      await axios.get(
        `${scheme}://${auth}${config.get('es_host')}:${config.get('es_port')}`, 
        {httpsAgent}
      );
    return parseInt(result.data.version['number'].split('.')[0], 10);
  } catch (error) {
    console.log(error);
  }

}

export async function clientSearch(index: any, type: any, qs: any, request: any, response: any) {

  try {
    const es_version = await getClientVersion();
    const client = await getClient();

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    if (es_version >= 7) {
      type = undefined;
    }

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    client.search({
      index: index,
      type: type,
      body: {
        from: request.query.from || 0,
        size: request.query.size || 100,
        query: {
          bool: {
            must: [
              {
                query_string: { query: qs }
              }
            ]
          }
        },
        sort: [{ '@timestamp': { order: 'desc' } }]
      }
    }, (err: any, {
      body
    }: any) => {
      if (err) {
        response.send({
          error: err
        });
      } else {
        body.hits.hits = body.hits.hits.map((h: any) => h._source);
        response.send(body.hits);
      }
    });
  } catch (error) {
    console.log(error);
  }

}

export async function getClient() {

  try {
    const es_version = await getClientVersion();

    let scheme = 'http';
    let ssl_body = {};

    if (config.get('es_ssl')) {
      scheme = 'https';
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'rejectUnauthorized' does not exist on ty... Remove this comment to see the full error message
      ssl_body.rejectUnauthorized = config.get('ea_verify_certs');

      if (config.get('es_ca_certs')) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'ca' does not exist on type '{}'.
        ssl_body.ca = fs.readFileSync(config.get('es_ca_certs'));
      }
      if (config.get('es_client_cert')) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'cert' does not exist on type '{}'.
        ssl_body.cert = fs.readFileSync(config.get('es_client_cert'));
      }
      if (config.get('es_client_key')) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'key' does not exist on type '{}'.
        ssl_body.key = fs.readFileSync(config.get('es_client_key'));
      }
    }

    let auth = '';
    
    if (config.get('es_username') && config.get('es_password')) {
      auth = `${config.get('es_username')}:${config.get('es_password')}@`;
    }

    if (config.get('opensearch_flg')) {

      // OpenSearch 1.0
      const client_opensearch = new opensearch.Client({
        node: [ `${scheme}://${auth}${config.get('es_host')}:${config.get('es_port')}`],
        ssl: ssl_body
      });
      return client_opensearch;    
    }

    if (es_version === 5) {

      // Elasticsearch 5.x
      const client5 = new elasticsearch5.Client({
        node: [ `${scheme}://${auth}${config.get('es_host')}:${config.get('es_port')}`],
        ssl: ssl_body
      });
      return client5;
    } else if (es_version == 6) {
      
      // Elasticsearch 6.x
      const client6 = new elasticsearch6.Client({
        node: [ `${scheme}://${auth}${config.get('es_host')}:${config.get('es_port')}`],
        ssl: ssl_body
      });
      return client6;
    } else if (es_version == 7) {      
      
      // Elasticsearch 7.x
      const client7 = new elasticsearch7.Client({
        node: [ `${scheme}://${auth}${config.get('es_host')}:${config.get('es_port')}`],
        ssl: ssl_body
      });
      return client7;
    } else if (es_version == 8) {
      
      //TODO: Elasticsearch 8.x
      //const client8 = new elasticsearch8.Client({
      //  node: [ `${scheme}://${auth}${config.get('es_host')}:${config.get('es_port')}`],
      //  ssl: ssl_body
      //});
      //return client8;
    }
  } catch (error) {
    console.log(error);
  }

}

