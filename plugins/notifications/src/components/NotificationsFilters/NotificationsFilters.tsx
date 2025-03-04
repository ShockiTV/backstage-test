/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';

import {
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { GetNotificationsOptions } from '../../api';

export type SortBy = Required<
  Pick<GetNotificationsOptions, 'sort' | 'sortOrder'>
>;

export type NotificationsFiltersProps = {
  unreadOnly?: boolean;
  onUnreadOnlyChanged: (checked: boolean | undefined) => void;
  createdAfter?: string;
  onCreatedAfterChanged: (value: string) => void;
  sorting: SortBy;
  onSortingChanged: (sortBy: SortBy) => void;
  saved?: boolean;
  onSavedChanged: (checked: boolean | undefined) => void;
};

export const CreatedAfterOptions: {
  [key: string]: { label: string; getDate: () => Date };
} = {
  last24h: {
    label: 'Last 24h',
    getDate: () => new Date(Date.now() - 24 * 3600 * 1000),
  },
  lastWeek: {
    label: 'Last week',
    getDate: () => new Date(Date.now() - 7 * 24 * 3600 * 1000),
  },
  all: {
    label: 'Any time',
    getDate: () => new Date(0),
  },
};

export const SortByOptions: {
  [key: string]: {
    label: string;
    sortBy: SortBy;
  };
} = {
  newest: {
    label: 'Newest on top',
    sortBy: {
      sort: 'created',
      sortOrder: 'desc',
    },
  },
  oldest: {
    label: 'Oldest on top',
    sortBy: {
      sort: 'created',
      sortOrder: 'asc',
    },
  },
  topic: {
    label: 'Topic',
    sortBy: {
      sort: 'topic',
      sortOrder: 'asc',
    },
  },
  origin: {
    label: 'Origin',
    sortBy: {
      sort: 'origin',
      sortOrder: 'asc',
    },
  },
};

const getSortByText = (sortBy?: SortBy): string => {
  if (sortBy?.sort === 'created' && sortBy?.sortOrder === 'asc') {
    return 'oldest';
  }
  if (sortBy?.sort === 'topic') {
    return 'topic';
  }
  if (sortBy?.sort === 'origin') {
    return 'origin';
  }

  return 'newest';
};

export const NotificationsFilters = ({
  sorting,
  onSortingChanged,
  unreadOnly,
  onUnreadOnlyChanged,
  createdAfter,
  onCreatedAfterChanged,
  saved,
  onSavedChanged,
}: NotificationsFiltersProps) => {
  const sortByText = getSortByText(sorting);

  const handleOnCreatedAfterChanged = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    onCreatedAfterChanged(event.target.value as string);
  };

  const handleOnViewChanged = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    if (event.target.value === 'unread') {
      onUnreadOnlyChanged(true);
      onSavedChanged(undefined);
    } else if (event.target.value === 'read') {
      onUnreadOnlyChanged(false);
      onSavedChanged(undefined);
    } else if (event.target.value === 'saved') {
      onUnreadOnlyChanged(undefined);
      onSavedChanged(true);
    } else {
      // All
      onUnreadOnlyChanged(undefined);
      onSavedChanged(undefined);
    }
  };

  const handleOnSortByChanged = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const idx = (event.target.value as string) || 'newest';
    const option = SortByOptions[idx];
    onSortingChanged({ ...option.sortBy });
  };

  let viewValue = 'all';
  if (saved) {
    viewValue = 'saved';
  } else if (unreadOnly) {
    viewValue = 'unread';
  } else if (unreadOnly === false) {
    viewValue = 'read';
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6">Filters</Typography>
          <Divider variant="fullWidth" />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-view">View</InputLabel>
            <Select
              labelId="notifications-filter-view"
              label="View"
              value={viewValue}
              onChange={handleOnViewChanged}
            >
              <MenuItem value="unread">New only</MenuItem>
              <MenuItem value="saved">Saved</MenuItem>
              <MenuItem value="read">Marked as read</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-view">
              Created after
            </InputLabel>

            <Select
              label="Created after"
              placeholder="Notifications since"
              value={createdAfter}
              onChange={handleOnCreatedAfterChanged}
            >
              {Object.keys(CreatedAfterOptions).map((key: string) => (
                <MenuItem value={key} key={key}>
                  {CreatedAfterOptions[key].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-sort">Sort by</InputLabel>

            <Select
              label="Sort by"
              placeholder="Field to sort by"
              value={sortByText}
              onChange={handleOnSortByChanged}
            >
              {Object.keys(SortByOptions).map((key: string) => (
                <MenuItem value={key} key={key}>
                  {SortByOptions[key].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};
