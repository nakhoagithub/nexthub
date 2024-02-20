import app from "./axios";

export async function getDatas({
  model,
  sort,
  filter,
  fields,
}: {
  model: string;
  sort?: any;
  filter?: any;
  fields?: string[];
}) {
  try {
    let newSort = {};
    if (sort) {
      newSort = sort;
    }
    let newFilter: any = {};
    if (filter) {
      newFilter = filter;
    }
    let apiUri = `/api/db/${model}?filter=${JSON.stringify(newFilter)}&sort=${JSON.stringify(newSort)}`;
    if (fields) {
      apiUri += `&fields=${(fields ?? []).join(",")}`;
    }
    const { data } = await app.get(apiUri);
    if (data.code === 200) {
      return data;
    }
  } catch (error) {}
}
