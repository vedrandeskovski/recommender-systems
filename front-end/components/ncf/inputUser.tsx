"use client";
import { getRatingsForUser, isUserTrained } from "@/services/ratings";
import { PaginatedMovies } from "@/types/movies";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import React, { useEffect, useRef, useState } from "react";
import MovieTable from "../table";
import SelectLists from "../selectList";
import UserNotFound from "./userNotFound";
import { NumberInput } from "@heroui/number-input";
import { getNCFRecommendation } from "@/services/ncf";
import { Alert } from "@heroui/alert";

interface InputUserProps {
  setRecommendationData: React.Dispatch<
    React.SetStateAction<PaginatedMovies | undefined>
  >;
  predPage: number;
  recommendationData: PaginatedMovies | undefined;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

const InputUser = ({
  setRecommendationData,
  predPage,
  recommendationData,
  setLoading,
  loading,
}: InputUserProps) => {
  const [inputUserID, setInputUserID] = useState<string>("");
  const [userID, setUserID] = useState<number>();
  const [userIDError, setUserIDError] = useState<boolean>(false);
  const [dataError, setDataError] = useState<boolean>(false);
  const [dataErrorMsg, setDataErrorMsg] = useState<string | undefined>("");
  const [data, setData] = useState<PaginatedMovies>();
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [order, setOrder] = useState<string | null>("asc");
  const [size, setSize] = useState<number>(10);
  const [numRecommendations, setNumRecommendations] = useState<number>(5);
  const [isUserIDTrained, setIsUserIDTrained] = useState<boolean>(true);
  const firstRender = useRef(true);

  const getValidUserId = () => {
    if (!inputUserID?.trim()) {
      setUserIDError(true);
      setData(undefined);
      setRecommendationData(undefined);
      return null;
    }

    const numericID = Number(inputUserID);
    if (isNaN(numericID)) {
      setUserIDError(true);
      setData(undefined);
      setRecommendationData(undefined);
      return null;
    }
    return numericID;
  };

  const fetchUserRatings = async () => {
    const numericID = getValidUserId();
    if (!numericID) {
      return;
    }

    setLoading(true);

    const response = await getRatingsForUser(
      numericID,
      sortBy,
      order,
      page,
      size
    );

    if (response.error) {
      setDataErrorMsg(response.errorMsg);
      setData(undefined);
      setDataError(true);
    } else {
      setUserID(numericID);
      setData(response);
      setDataError(false);
    }
    const isTrained = await isUserTrained(numericID);
    if (!response.error) {
      setIsUserIDTrained(isTrained);
    }
    setLoading(false);
  };

  const fetchNCFRecommendations = async () => {
    if (!userID) {
      setUserIDError(true);
      return;
    }
    setLoading(true);
    const response = await getNCFRecommendation(
      userID,
      numRecommendations,
      predPage,
      10
    );
    if (response.error) {
      setDataErrorMsg(response.errorMsg);
      setRecommendationData(undefined);
      setData(undefined);
      setDataError(true);
    } else {
      setRecommendationData(response);
      setDataError(false);
    }
    setLoading(false);
  };

  const getUserRatings = () => {
    setRecommendationData(undefined);
    setNumRecommendations(5);
    setPage(1);
    setDataError(false);
    fetchUserRatings();
  };

  const getNCFRecommendations = () => {
    setDataError(false);
    fetchNCFRecommendations();
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!inputUserID?.trim()) return;
    fetchUserRatings();
  }, [sortBy, order, size, page]);

  useEffect(() => {
    if (!inputUserID?.trim()) return;
    getNCFRecommendations();
  }, [predPage]);

  // useEffect(() => {
  //   if (recommendationData && !dataError) {
  //     window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  //   }
  // }, [recommendationData, dataError]);

  return (
    <>
      <div className="flex items-start gap-x-5">
        <Input
          label="User ID"
          placeholder="Enter a user ID"
          className="max-w-xl"
          size="lg"
          type="text"
          value={inputUserID}
          isInvalid={userIDError}
          errorMessage="Please enter a valid user ID"
          onChange={(e) => {
            setInputUserID(e.target.value);
            setUserIDError(false);
          }}
        />

        <Button className="mt-3" color="secondary" onPress={getUserRatings}>
          Sign in
        </Button>

        {loading && <Spinner className="mt-3" color="secondary" />}
        {!isUserIDTrained && (
          <UserNotFound color="warning" text="This user is not trained on!" />
        )}
      </div>
      {dataError && <UserNotFound color="danger" text={dataErrorMsg} />}
      {!dataError && data && (
        <div className="flex flex-col gap-y-3">
          <Divider />
          <div className="flex justify-around items-center mb-4">
            <div className="flex items-center w-[80vh] gap-x-6">
              <SelectLists
                sortBy={sortBy}
                order={order}
                size={size}
                setSortBy={setSortBy}
                setOrder={setOrder}
                setSize={setSize}
                movie={data.items[0]}
              />
            </div>
            <div className="flex flex-row-reverse items-center gap-x-6">
              <Button
                size="lg"
                color="secondary"
                onPress={getNCFRecommendations}
              >
                Recommend
              </Button>
              <NumberInput
                aria-label="Number of recommendations"
                value={numRecommendations}
                onChange={(value) => setNumRecommendations(Number(value))}
                placeholder="Number of recommendations"
                // label="Enter number of recommendations: "
                // labelPlacement="outside-left"
                minValue={1}
              />
            </div>
          </div>
          <div className="flex flex-col overflow-hidden h-[70vh]">
            <div className="overflow-auto">
              <MovieTable
                data={data}
                page={page}
                setPage={setPage}
                movie={data.items[0]}
              />
            </div>
          </div>
          <Divider />
        </div>
      )}
    </>
  );
};

export default InputUser;
