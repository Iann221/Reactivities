import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Header} from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";

// interface Props {
//     activities: Activity[];
//     deleteActivity: (id: string) => (void);
//     submitting: boolean;
// }

export default observer(function ActivityList(){
    const {activityStore} = useStore();
    const {groupedActivities} = activityStore;

    return (
        <>
            {groupedActivities.map(([group,activities]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {activities.map(activity => (
                        // pokonya klo mau specify kita bikin elemen unik, hrs pake key 
                        <ActivityListItem key={activity.id} activity={activity}/>
                    ))}
                </Fragment>
            ))}
        </>

    )
})