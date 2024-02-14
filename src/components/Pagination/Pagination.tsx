import { Pagination as PaginationPF, PaginationVariant } from '@patternfly/react-core';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useResizeObserver } from 'hooks/useResizeObserver';

import { ContentBox } from 'components/ContentBox/ContentBox';

import { getComponentQueryParamsObject, updateQueryParamsInURL } from 'utils/queryParamsHelper';

// threshold when compact mode of the pagination is toggled
const PAGINATION_WIDTH_THRESHOLD_PX = 400;

const pageSizeOptions = {
  page10: { title: '10', value: 10 },
  page15: { title: '15', value: 15 },
  page20: { title: '20', value: 20 },
  page50: { title: '50', value: 50 },
  page200: { title: '200', value: 200 },
};

const perPageOptions = Object.values(pageSizeOptions);

interface IPagination {
  componentId: string;
  count?: number;
  pageSizeDefault?: keyof typeof pageSizeOptions;
  isCompact?: boolean;
}

export const Pagination = ({ componentId, count = 0, pageSizeDefault = 'page10', isCompact }: IPagination) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pageSizeDefaultValue = useMemo(() => pageSizeOptions[pageSizeDefault].value, [pageSizeDefault]);

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(pageSizeDefaultValue);

  const { ref: paginationRef, width: paginationWidth } = useResizeObserver();

  // history.location.search changes are watched to add browser back and forward support
  // Query Params coming from the URL are the single point of truth.
  useEffect(() => {
    // add pageIndex or pageSize when it's not available in the URL
    const componentQueryParamsObject = getComponentQueryParamsObject(location.search, componentId);
    if (!(componentQueryParamsObject.pageIndex && componentQueryParamsObject.pageSize)) {
      // replace the current entry on the history stack, otherwise back button would not be working because of the redirection
      // from page without params to page with params
      updateQueryParamsInURL({ pageIndex: 1, pageSize: pageSizeDefaultValue }, componentId, location, navigate, true);
    } else {
      setPageIndex(Number(componentQueryParamsObject.pageIndex));
      setPageSize(Number(componentQueryParamsObject.pageSize));
    }
  }, [location.search, location, componentId, pageSizeDefaultValue, navigate]); // primary: history.location.search

  // RENDERING

  // pagination is rendered for the first time
  if (count === undefined) {
    return null;
  }

  // pagination was already rendered
  return (
    <ContentBox>
      <div ref={paginationRef}>
        <PaginationPF
          itemCount={count}
          perPage={pageSize}
          page={pageIndex}
          onSetPage={(_event, pageIndex) => {
            updateQueryParamsInURL({ pageIndex }, componentId, location, navigate);
            setPageIndex(pageIndex);
          }}
          onPerPageSelect={(_event, pageSize) => {
            const pageIndexDefault = 1;
            updateQueryParamsInURL({ pageIndex: pageIndexDefault, pageSize }, componentId, location, navigate);
            setPageSize(pageSize);
            setPageIndex(pageIndexDefault);
          }}
          variant={PaginationVariant.bottom}
          isCompact={isCompact !== undefined ? isCompact : !!paginationWidth && paginationWidth < PAGINATION_WIDTH_THRESHOLD_PX}
          perPageOptions={perPageOptions}
        />
      </div>
    </ContentBox>
  );
};
