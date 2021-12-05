import { getClient } from '../../common/elasticsearch_client';

export default async function indicesHandler(request: any, response: any) {
  /**
   * @type {ElastalertServer}
   */
  
  try {
    const client = await getClient();

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    client.cat.indices({
      h: ['index']
    }, (err: any, {
      body
    }: any) => {
      if (err)  {
        response.send({
          error: err
        });
      } else {
        let indices = body.trim().split('\n');
        response.send(indices);
      }
    });
  } catch (error) {
    console.log(error);
  }

}
