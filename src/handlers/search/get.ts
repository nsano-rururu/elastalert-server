import { getClient } from '../../common/elasticsearch_client';

export default async function searchHandler(request: any, response: any) {
  /**
   * @type {ElastalertServer}
   */

  try {
    const client = await getClient();

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    client.search({
      index: request.params.index,
      body: request.body
    }, (err: any, {
      body
    }: any) => {
      if (err)  {
        response.send({
          error: err
        });
      } else {
        response.send(body);
      }
    });
  } catch (error) {
    console.log(error);
  }

}
