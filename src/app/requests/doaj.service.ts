import { http } from "../vendors/axiosDOAJ.vendors";

export const fetchArticleExistsByISSNDOAJ = async (issn: String): Promise<any> => {
  const url = 'journals/issn:' + issn
  const { data } = await http.get(url);
  return data;
};