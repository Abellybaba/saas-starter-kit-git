import type { NextPageWithLayout } from "types";
import { useState } from "react";
import { Button } from "react-daisyui";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Loading, Error } from "@/components/ui";
import { TeamTab, Members } from "@/components/interfaces/Team";
import {
  InviteMember,
  PendingInvitations,
} from "@/components/interfaces/Invitation";

import useTeam from "hooks/useTeam";
import { GetServerSidePropsContext } from "next";

const TeamMembers: NextPageWithLayout = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { slug } = router.query;

  const [visible, setVisible] = useState(false);

  const { isLoading, isError, team } = useTeam(slug as string);

  if (isLoading || !team) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <h3 className="text-2xl font-bold">{team.name}</h3>
      <TeamTab team={team} activeTab="members" />
      <div className="flex items-center justify-end">
        <Button
          size="sm"
          color="primary"
          className="text-white"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {t("add-member")}
        </Button>
      </div>
      <Members team={team} />
      <PendingInvitations team={team} />
      <InviteMember visible={visible} setVisible={setVisible} team={team} />
    </>
  );
};

export async function getServerSideProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ["common"]) : {}),
    },
  };
}

export default TeamMembers;
