"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RAGHealthCheck } from "./RAGHealthCheck";
import { RAGTestQuery } from "./RAGTestQuery";
import { RAGConnectionInfo } from "./RAGConnectionInfo";

export function RAGTestPanel() {
  return (
    <Tabs defaultValue="health" className="w-full">
      <TabsList>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="query">Test Query</TabsTrigger>
        <TabsTrigger value="connection">Connection</TabsTrigger>
      </TabsList>
      <TabsContent value="health">
        <RAGHealthCheck />
      </TabsContent>
      <TabsContent value="query">
        <RAGTestQuery />
      </TabsContent>
      <TabsContent value="connection">
        <RAGConnectionInfo />
      </TabsContent>
    </Tabs>
  );
}
