import { getClient } from '../../common/elasticsearch_client';

export default async function searchHandler(request, response) {
  /**
   * @type {ElastalertServer}
   */

  try {
    const client = await getClient();

    if (es_version >= 8) {

      try {
        
        // async-style (sugar syntax on top of promises)
        const result = await client.search({
          index: request.params.index,
          document: request.body
        })
        response.send(result);
      } catch(err) {
        response.send({
          error: err
        });
      }
    } else {

      // callback API
      client.search({
        index: request.params.index,
        body: request.body
      }, (err, {body}) => {
        if (err)  {
          response.send({
            error: err
          });
        } else {
          response.send(body);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }

}
