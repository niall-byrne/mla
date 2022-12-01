import { Text, Flex } from "@chakra-ui/react";
import VerticalScrollBarContainer from "@src/components/scrollbars/vertical/vertical.scrollbar.container";
import type SunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type { SunBurstDrawerNodeComponentProps } from "@src/types/clients/api/lastfm/sunburst.types";
import type { FC, RefObject } from "react";

export const testIDs = {
  SunBurstEntityNodeListTitle: "SunBurstEntityNodeListTitle",
  SunBurstEntityNodeList: "SunBurstEntityNodeList",
};

export const ids = {
  SunburstDrawerEntityListScrollArea: "SunburstDrawerEntityListScrollArea",
};

export interface SunBurstEntityNodeListProps {
  EntityComponent: FC<SunBurstDrawerNodeComponentProps>;
  node: SunBurstNodeAbstractBase;
  scrollRef: RefObject<HTMLDivElement>;
  selectChildNode: (node: SunBurstNodeAbstractBase) => void;
  svgTransition: boolean;
  titleText: string;
}

export default function SunBurstEntityNodeList({
  EntityComponent,
  node,
  scrollRef,
  selectChildNode,
  titleText,
}: SunBurstEntityNodeListProps) {
  return (
    <>
      <Text
        data-testid={testIDs.SunBurstEntityNodeListTitle}
        mb={"10px"}
        fontSize="sm"
      >
        {titleText}
      </Text>

      <div
        id={ids.SunburstDrawerEntityListScrollArea}
        ref={scrollRef}
        className={"scrollbar"}
      >
        <VerticalScrollBarContainer
          scrollRef={scrollRef}
          update={node}
          horizontalOffset={10}
          verticalOffset={0}
          zIndex={5000}
        />
        <Flex
          data-testid={testIDs.SunBurstEntityNodeList}
          flexDirection={"column"}
        >
          {node.getChildren().map((child, index) => (
            <EntityComponent
              key={index}
              index={index}
              node={child}
              selectChildNode={selectChildNode}
            />
          ))}
        </Flex>
      </div>
    </>
  );
}
