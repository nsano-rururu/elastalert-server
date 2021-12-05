import config from '../../common/config';
import { getClient, escapeLuceneSyntax, clientSearch, getClientVersion } from '../../common/elasticsearch_client';

export async function metadataElastalertPastHandler(request: any, response: any) {
  
  try {
    const es_version = await getClientVersion();
    let index;

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    if (es_version > 5) {
      index = config.get('writeback_index') + '_past';
    } else {
      index = config.get('writeback_index');
    }

    let qs = '*:*';

    if (request.query.rule_name) {
      qs = `rule_name:"${escapeLuceneSyntax(request.query.rule_name)}"`;
    }

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    clientSearch(index, es_version > 5 ? undefined : 'past_elastalert', qs, request, response);  
  } catch (error) {
    console.log(error);
  }

}

export async function metadataElastalertErrorHandler(request: any, response: any) {

  try {
    const es_version = await getClientVersion();
    let index;

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    if (es_version > 5) {
      index = config.get('writeback_index') + '_error';
    } else {
      index = config.get('writeback_index');
    }

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    clientSearch(index, es_version > 5 ? undefined : 'elastalert_error', '*:*', request, response);  
  } catch (error) {
    console.log(error);
  }

}

export async function metadataElastalertSilenceHandler(request: any, response: any) {

  try {
    const es_version = await getClientVersion();
    let index;

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    if (es_version > 5) {
      index = config.get('writeback_index') + '_silence';
    } else {
      index = config.get('writeback_index');
    }

    let qs = '*:*';

    if (request.query.rule_name) {
      qs = `rule_name:"${escapeLuceneSyntax(request.query.rule_name)}" OR "${escapeLuceneSyntax(request.query.rule_name + '._silence')}"`;
    }

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    clientSearch(index, es_version > 5 ? undefined : 'silence', qs, request, response);      
  } catch (error) {
    console.log(error);
  }

}

export async function metadataElastalertStatusHandler(request: any, response: any) {

  try {
    const es_version = await getClientVersion();
    let index;

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    if (es_version > 5) {
      index = config.get('writeback_index') + '_status';
    } else {
      index = config.get('writeback_index');
    }

    let qs = '*:*';

    if (request.query.rule_name) {
      qs = `rule_name:"${escapeLuceneSyntax(request.query.rule_name)}"`;
    }

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    clientSearch(index, es_version > 5 ? undefined : 'elastalert_status', qs, request, response);  
  } catch (error) {
    console.log(error);
  }

}

export async function metadataElastalertHandler(request: any, response: any) {

  try {
    const es_version = await getClientVersion();
    const client = await getClient();
    const index = config.get('writeback_index');
    let qs;

    if (request.query.rule_name) {
      qs = `rule_name:"${escapeLuceneSyntax(request.query.rule_name)}"`;
    }
    else if (request.query.noagg) {
      qs = 'NOT aggregate_id:*';
    }
    else {
      qs = '*:*';
    }

    let type = 'elastalert';

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    if (es_version >= 7) {
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'undefined' is not assignable to type 'string... Remove this comment to see the full error message
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
              },
              {
                range: {
                  'alert_time': {
                    lte: 'now',
                  }
                }
              }
            ]
          }
        },
        sort: [{ 'alert_time': { order: 'desc' } }]
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
