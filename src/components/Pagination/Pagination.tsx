import { Pagination as PaginationPF, PaginationVariant } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { getComponentQueryParamsObject, updateQueryParamsInURL } from '../../utils/queryParamsHelper';
import './Pagination.css';

interface IPagination {
  componentId: string;
  count: number;
  pageSizeDefault?: number;
}

export const Pagination = ({ componentId, count, pageSizeDefault = 10 }: IPagination) => {
  const history = useHistory();

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(pageSizeDefault);

  // history.location.search changes are watched to add browser back and forward support
  // Query Params coming from the URL are the single point of truth.
  useEffect(() => {
    // add pageIndex or pageSize when it's not available in the URL
    const componentQueryParamsObject = getComponentQueryParamsObject(history.location.search, componentId);
    if (!(componentQueryParamsObject.pageIndex && componentQueryParamsObject.pageSize)) {
      updateQueryParamsInURL({ pageIndex: 1, pageSize: pageSizeDefault }, componentId, history);
    } else {
      setPageIndex(Number(componentQueryParamsObject.pageIndex));
      setPageSize(Number(componentQueryParamsObject.pageSize));
    }
  }, [history.location.search, history, componentId, pageSizeDefault]); // primary: history.location.search

  // RENDERING

  // pagination is rendered for the first time
  if (count === undefined) {
    return <div>pagination initializing...</div>;
  }

  // pagination was already rendered
  return (
    <div className="pagination">
      <PaginationPF
        itemCount={count}
        perPage={pageSize}
        page={pageIndex}
        onSetPage={(_event, pageIndex) => {
          updateQueryParamsInURL({ pageIndex }, componentId, history);
          setPageIndex(pageIndex);
        }}
        onPerPageSelect={(_event, pageSize) => {
          updateQueryParamsInURL({ pageSize }, componentId, history);
          setPageSize(pageSize);
        }}
        variant={PaginationVariant.bottom}
      />
    </div>
  );
};
