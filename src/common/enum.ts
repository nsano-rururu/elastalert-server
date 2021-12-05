export default function Enum(a: any) {
  let i = Object
    .keys(a)
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    .reduce((o, k)=>(o[a[k]] = k, o), {});

  return Object.freeze(
    Object.keys(a).reduce(
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      (o, k)=>(o[k] = a[k], o), (v: any) => i[v]
    )
  );
}
