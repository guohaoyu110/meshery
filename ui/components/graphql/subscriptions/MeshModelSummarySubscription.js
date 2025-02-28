import { graphql, requestSubscription } from "react-relay";
import environment from "../../../lib/relayEnvironment";

export const meshmodelSummarySubscription = graphql`
  subscription MeshModelSummarySubscription($selector: MeshModelSummarySelector!) {
    meshmodelSummary: subscribeMeshModelSummary(selector: $selector) {
      components {
        name,
        count
      },
      relationships {
        name,
        count
      }
    }
  }
`;

export default function subscribeClusterResources(dataCB, variables) {
  return requestSubscription(environment, {
    subscription : meshmodelSummarySubscription,
    variables : variables,
    onNext : dataCB,
    onError : (error) => console.log(`MeshModel Subscription error:`, error),
  });
}
