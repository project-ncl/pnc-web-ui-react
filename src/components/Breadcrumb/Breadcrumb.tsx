import { BreadcrumbItem as BreadcrumbItemPF, Breadcrumb as BreadcrumbPF } from '@patternfly/react-core';
import { Link, useMatches } from 'react-router';

import { TBreadcrumb, breadcrumbData } from 'common/breadcrumbData';

import { uiLogger } from 'services/uiLogger';

import { isString } from 'utils/entityRecognition';

export interface IBreadcrumbData {
  entity: string;
  title?: string;
  url?: string;
  custom?: boolean /** see {@link Breadcrumb} */;
}

interface IBreadcrumbObject {
  [key: string]: IBreadcrumbData;
}

const convertBreadcrumbData = (breadcrumbData: IBreadcrumbData[]) => {
  const breadcrumbObject: IBreadcrumbObject = {};
  const breadcrumbCustoms: IBreadcrumbData[] = [];

  breadcrumbData.forEach((breadcrumb: IBreadcrumbData) => {
    if (breadcrumb.custom) {
      breadcrumbCustoms.push(breadcrumb);
    } else if (!breadcrumbObject[breadcrumb.entity]) {
      breadcrumbObject[breadcrumb.entity] = breadcrumb;
    } else {
      uiLogger.error('convertBreadcrumbData: "entity" attributes need to be unique in pageBreadcrumbs');
    }
  });

  return JSON.parse(
    JSON.stringify({
      breadcrumbObject,
      breadcrumbCustoms,
    })
  );
};

interface IBreadcrumbProps {
  pageBreadcrumbs: IBreadcrumbData[];
}

/**
 * This part generates title and url of the breadcrumb. We divide crumbs to crumbs from handle from where we need url
 * and crumbs from pages from where we need titles with entity names. These crumbs should then match with each other if
 * title should be replaced with entity. This is ensured by passing of id with type from {@link breadcrumbData}. If no match
 * is found title is not replaced.
 *
 * URL manipulation is done on String basis with + or - on the beginning of the string url parameter coming from page
 * crumb.
 *
 * url: '-/edit' - this will take url from match and remove part of the url from specified parameter to the end
 *  - before: /projects/100/edit
 *  - after: /projects/100
 *
 * url: '+/edit' - this will take url from match and add specified path to existing url
 *  - before: /projects/100
 *  - after: /projects/100/edit
 *
 * On top of that there is custom=true page crumbs that don't match with match.handle crumbs. These are added in order
 * like specified on pages after all matched crumbs. Titles are not manipulated and are coming from pages, url is not
 * present by default because they don't have match from handle crumb. Url could be supplied from last handle crumb by
 * using url: '+somethingYouWantToAdd' parameter. This will join url from previous crumb with path addition specified
 * in current crumb.
 */
export const Breadcrumb = ({ pageBreadcrumbs }: IBreadcrumbProps) => {
  const convertedBreadcrumbData = convertBreadcrumbData(pageBreadcrumbs);
  const pageBreadcrumbsObject = convertedBreadcrumbData.breadcrumbObject;

  const matches = useMatches();
  const matchCrumbs = matches.filter((match) => match.handle !== undefined && isString(match.handle));
  const breadcrumbArray = matchCrumbs
    .map((match) => {
      const matchHandle = match.handle as TBreadcrumb;

      let breadcrumb: IBreadcrumbData;
      const pageBreadcrumb = pageBreadcrumbsObject[matchHandle];

      if (!pageBreadcrumb) {
        // no matching crumb id found in crumbs coming from pages, using default title
        breadcrumb = { entity: matchHandle, title: breadcrumbData[matchHandle].title, url: match.pathname };
      } else {
        // matching crumb id found in crumbs coming from pages, replacing url and changing title
        let matchPathname = match.pathname;
        if (pageBreadcrumb.url?.startsWith('+')) {
          matchPathname = match.pathname + pageBreadcrumb.url.substring(1);
        } else if (pageBreadcrumb.url?.startsWith('-')) {
          matchPathname = match.pathname.split(pageBreadcrumb.url.substring(1))[0];
        }

        const titleHelp = pageBreadcrumb.title
          ? pageBreadcrumb.title
          : breadcrumbData[pageBreadcrumb.entity as TBreadcrumb].title;
        breadcrumb = { entity: matchHandle, title: titleHelp, url: matchPathname };
      }
      return breadcrumb;
    })
    .concat(convertedBreadcrumbData.breadcrumbCustoms);

  const breadcrumbs = breadcrumbArray.map((breadcrumb, index, array) => {
    const isLast = array.length - 1 === index;
    if (breadcrumb.url?.startsWith('+')) {
      breadcrumb.url = array[index - 1]?.url + breadcrumb.url.substring(1);
    }
    return (
      <BreadcrumbItemPF key={index} isActive={isLast}>
        {isLast ? breadcrumb.title : <Link to={breadcrumb.url!}> {breadcrumb.title}</Link>}
      </BreadcrumbItemPF>
    );
  });

  // hiding breadcrumbs on first level of pages = /products,/projects etc.
  if (!breadcrumbs.at(1)) {
    return null;
  }
  return <BreadcrumbPF>{breadcrumbs}</BreadcrumbPF>;
};
