import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { NotionAPI } from 'notion-client';
import { NotionRenderer } from 'react-notion-x';
import { useRouter } from 'next/router';
import { Collection } from 'react-notion-x/build/third-party/collection';

import hackerpackSettings from './Components/hackerpack-settings.json';
import HackerpackSidebar from './Components/HackerpackSidebar';
import MobileDropdownMenu from './Components/MobileDropdownMenu';

export default function NotionSubpage(props: { content: any; error: boolean }) {
  const router = useRouter();
  // If the hackerpack is not a Notion page, ignore it
  if (props.error) {
    router.push('/hackerpacks');
    return null;
  }

  // Adjust width of the main content if sidebar is present
  const adjustedWidth = hackerpackSettings.sidebar ? 'md:w-5/6 2xl:w-7/8' : '';

  console.log(props.content.block);
  // Generate the sidebar content from Notion
  // Find the root block because Notion IDs have hyphens
  const rootId = Object.keys(props.content.block).find(
    (k) => k === router.asPath.replace('/hackerpacks/', ''),
  );

  // Get the ordered list of blocks
  const rootObj = props.content.block[rootId];
  const blockList = rootObj.value.content;

  // Parse through the blocks and extract text/ids from
  // the blocks that are either 'header' or 'sub_header' (h1 and h2)
  let actualSidebarContent = [];
  if (blockList != null) {
    const firstObj = props.content.block[blockList[0]];
    let currH1 = {
      title: firstObj.value.properties.title[0][0],
      href: '#' + firstObj.value.id.replaceAll(/-/g, ''),
      sections: [],
    };
    for (let i = 1; i < blockList.length; i++) {
      const currObj = props.content.block[blockList[i]];
      if (currObj.value.type === 'sub_header') {
        currH1.sections.push({
          title: currObj.value.properties.title[0][0],
          href: '#' + currObj.value.id.replaceAll(/-/g, ''),
        });
      } else if (currObj.value.type === 'header') {
        actualSidebarContent.push(currH1);
        currH1 = {
          title: currObj.value.properties.title[0][0],
          href: '#' + currObj.value.id.replaceAll(/-/g, ''),
          sections: [],
        };
      }
    }
    actualSidebarContent.push(currH1);
  }
  return (
    <div className="flex flex-col md:flex-row flex-grow flex-wrap home overflow-x-hidden">
      <Head>
        <title>HackerPacks</title>
        <meta name="description" content="HackerPack Information" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {hackerpackSettings.sidebar && (
        <>
          <HackerpackSidebar content={actualSidebarContent} />
          <MobileDropdownMenu
            name="HackerPack"
            content={actualSidebarContent}
            className="flex md:hidden"
          />
        </>
      )}
      <section id="mainContent" className={`mt-12 px-6 py-3 relative w-full ${adjustedWidth}`}>
        <NotionRenderer
          recordMap={props.content}
          darkMode={true}
          mapPageUrl={(pageId) => `/hackerpacks/${pageId}`}
          components={{ Collection }}
        />
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Load Notion page data from Notion API
  // Catch invalid IDs and make sure content is generated from Notion pages
  try {
    if (hackerpackSettings.mainContent === 'notion') {
      const notion = new NotionAPI();
      const page = await notion.getPage(context.params['id'] as string);
      return { props: { content: page, error: false } };
    }
  } catch (err) {}
  return { props: { content: null, error: true } };
};
