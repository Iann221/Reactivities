import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Grid, Loader } from 'semantic-ui-react';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

// interface Props {
//     activities: Activity[];
//     deleteActivity: (id: string) => (void)
//     submitting: boolean
// }

export default observer(function ActivityDashboard(){

    const {activityStore} = useStore();
    const {loadActivities, activityRegistry, setPagingParams, pagination} = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);
    // const {selectedActivity, editMode} = activityStore // destructure

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => { // what we want to do when our app loads up
        if(activityRegistry.size <= 1) loadActivities();
    }, [loadActivities, activityRegistry]) // [] tu dependency agar ga manggil useEffect berkali setelah loaded
    
    // if(activityStore.loadingInitial && !loadingNext) return <LoadingComponent content='Loading Activities...'/>

    return (
        <Grid>
            {/* grid pny 16 length cenah */}
            <Grid.Column width={'10'}> 
                {activityStore.loadingInitial && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder/>
                        <ActivityListItemPlaceholder/>
                    </>
                ): (
                    <InfiniteScroll 
                    pageStart={0} // page mulai dari 0
                    loadMore={handleGetNext}
                    hasMore={!loadingNext && !!pagination && pagination.currentPage<pagination.totalPages} 
                    // kasitau punya more klo tidak loadingNext, punya pagination dan current<total
                    initialLoad={false} // gperlu krn udh ada useeffect
                >
                    <ActivityList />
                </InfiniteScroll>
                )}    
            </Grid.Column>
            <Grid.Column width={'6'}>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={'10'}>
                <Loader active={loadingNext}/>
            </Grid.Column>
        </Grid>
    )
})