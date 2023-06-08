import { readFile, writeFile } from "node:fs";
import { resolve, parse } from "node:path";
import { promisify } from "node:util";
import { render } from "mustache";
import glob from "tiny-glob";

const readFile$ = promisify(readFile);
const writeFile$ = promisify(writeFile);

const mdExt = ".md";
const tmplMdExt = ".tmpl.md";
const jsonExt = ".json";

const dataDir = `${resolve(process.cwd())}/_data`;
const outDir = `${resolve(process.cwd())}/_output/`;
const tmplDir = `${resolve(process.cwd())}/_templates`;

const getTemplateFiles = async (directory: string, extension: string) =>
  await getFiles(directory, extension);

const getFiles = async (directory: string, extension: string) =>
  await glob(`*${extension}`, {
    cwd: directory,
  });

const getData = async (
  directory: string,
  fileName: string,
  extension: string = ""
) =>
  extension !== "" && fileName
    ? (await readFile$(`${directory}/${fileName}${extension}`)).toString()
    : null;

const generateOutput = async (
  directory: string,
  fileName: string,
  extension: string = "",
  data: any
): Promise<void> =>
  await writeFile$(`${directory}/${fileName}${extension}`, data);

const init = async () => {
  return await Promise.all([
    ...(
      await getTemplateFiles(tmplDir, tmplMdExt)
    ).map(async (fileName) => {
      try {
        let fName = parse(parse(fileName).name).name;
        let data = await getData(dataDir, fName, jsonExt);
        let template = await getData(tmplDir, fName, tmplMdExt);
        await generateOutput(
          outDir,
          fName,
          mdExt,
          render(template, JSON.parse(data))
        );
        return `${fName}.md has generated`;
      } catch (error) {
        return error;
      }
    }),
  ]);
};

(async () => {
  const output = await init();
  console.log(output);
})();
