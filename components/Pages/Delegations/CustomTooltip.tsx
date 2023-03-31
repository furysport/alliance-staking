import {Box, Divider, HStack, Text, VStack, Tooltip} from "@chakra-ui/react";
import React from "react";
import {useEffect, useRef, useState} from "react";
import {WhaleType} from "./AssetOverview";
import {StakingData} from "./types/StakingData";

export interface TooltipProps {
    data: StakingData[];
    withdrawableAmpWhale?: number;
    withdrawableBWhale?: number;
    label: string;
    isWalletConnected: boolean;
}

export const CustomTooltip = ({data, label, isWalletConnected, tokenType,
                                 withdrawableAmpWhale, withdrawableBWhale
                             }: TooltipProps) => {
    const { whale = null, ampWhale = null, bWhale = null} = data?.find(e => e.tokenType == tokenType) || {}

    const lsdTokenDetails = [{
        type: WhaleType.bWHALE,
        value:withdrawableBWhale ?? bWhale}, {
        type: WhaleType.ampWHALE,
        value:withdrawableAmpWhale ?? ampWhale
    }].sort((a, b) => b.value - a.value);

    const TokenDetail = ({whaleType, value}) => {
        return <HStack
            justify="space-between"
            direction="row"
            width="full"
            px={2}>
            <Text
                color="whiteAlpha.600"
                fontSize={14}>
                {WhaleType[whaleType]}
            </Text>
            <Text
                fontSize={14}>
                {isWalletConnected ? value : "n/a"}
            </Text>
        </HStack>
    }
    const textRef = useRef(null);
    const [textWidth, setTextWidth] = useState(0);

    useEffect(() => {
        setTextWidth(textRef.current.offsetWidth);
    }, [whale, ampWhale, bWhale]);

    return <Tooltip
        sx={{boxShadow: "none"}}
        label={
            <VStack
                minW="250px"
                minH="50px"
                borderRadius="10px"
                bg="blackAlpha.900"
                px="4"
                py="4"
                position="relative"
                border="none"
                justifyContent="center"
                alignItems="center">
                {ampWhale === null && withdrawableAmpWhale == null ?
                    <Text>
                       </Text> :
                    <>{tokenType === TokenType.liquid ?
                        <> <TokenDetail
                            whaleType={WhaleType.WHALE}
                            value={whale}/>
                            <Divider
                                width="93%"
                                borderWidth="0.1px"
                                color="whiteAlpha.300"/>
                        </> : null
                    }
                        {lsdTokenDetails.map((e, index) => {
                            return <React.Fragment key={e.type}>
                                <TokenDetail
                                    whaleType={e.type}
                                    value={e.value}/>
                                {index === 0 &&
                                    <Divider
                                        width="93%"
                                        borderWidth="0.1px"
                                        color="whiteAlpha.300"/>
                                }
                            </React.Fragment>
                        })
                        }
                    </>
                }
            </VStack>}
        bg="transparent">
        <VStack alignItems="flex-start" minW={100}>
            <Text
                ref={textRef}
                mb="-0.3rem"
                color="white">
                {label}
            </Text>
            <Box pb={1}>
                {label !== "n/a" && <div
                    style={{
                        width: `${textWidth}px`,
                        height: '1px',
                        background: `repeating-linear-gradient(
            to right,
            white,
            white 1px,
            transparent 1px,
            transparent 5px
          )`,
                    }}
                />}
            </Box>
        </VStack>
    </Tooltip>
}