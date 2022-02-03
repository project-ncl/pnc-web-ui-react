import { Pagination as PaginationPF, PaginationVariant } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getComponentQueryParamsObject, updateQueryParamsInURL } from '../../utils/queryParamsHelper';
import './Pagination.css';

interface IPagination {
  componentId: string;
  count: number;
  pageSizeDefault?: number;
}

export const Pagination = ({ componentId, count, pageSizeDefault = 10 }: IPagination) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(pageSizeDefault);

  // history.location.search changes are watched to add browser back and forward support
  // Query Params coming from the URL are the single point of truth.
  useEffect(() => {
    // add pageIndex or pageSize when it's not available in the URL
    const componentQueryParamsObject = getComponentQueryParamsObject(location.search, componentId);
    if (!(componentQueryParamsObject.pageIndex && componentQueryParamsObject.pageSize)) {
      updateQueryParamsInURL({ pageIndex: 1, pageSize: pageSizeDefault }, componentId, location, navigate);
    } else {
      setPageIndex(Number(componentQueryParamsObject.pageIndex));
      setPageSize(Number(componentQueryParamsObject.pageSize));
    }
  }, [location.search, location, componentId, pageSizeDefault, navigate]); // primary: history.location.search

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
          updateQueryParamsInURL({ pageIndex }, componentId, location, navigate);
          setPageIndex(pageIndex);
        }}
        onPerPageSelect={(_event, pageSize) => {
          updateQueryParamsInURL({ pageSize }, componentId, location, navigate);
          setPageSize(pageSize);
        }}
        variant={PaginationVariant.bottom}
      />
    </div>
  );
};
