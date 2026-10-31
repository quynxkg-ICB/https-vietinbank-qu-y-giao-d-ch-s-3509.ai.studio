/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import contentDataRaw from './data/contentData.json';
import { ContentData } from './types';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeOverview } from './components/HomeOverview';
import { FaqSection } from './components/features/FaqSection';
import { DownloadIpaySection } from './components/features/DownloadIpaySection';
import { DepositInterestSection } from './components/features/DepositInterestSection';
import { LoanScheduleSection } from './components/features/LoanScheduleSection';
import { FeaturedProductsSection } from './components/features/FeaturedProductsSection';
import { BranchesSection } from './components/features/BranchesSection';
import { GameSection } from './components/features/GameSection';
import { ConsultantModal } from './components/ConsultantModal';

const contentData = contentDataRaw as unknown as ContentData;

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isConsultantModalOpen, setIsConsultantModalOpen] = useState<boolean>(false);
  const [exitNotification, setExitNotification] = useState<string | null>(null);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishSession = () => {
    setExitNotification(contentData.bankInfo.thanksExitMessage);
    setActiveTab('home');
    setTimeout(() => {
      setExitNotification(null);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-[#004b87] selection:text-white">
      <div>
        {/* Header */}
        <Header
          bankInfo={contentData.bankInfo}
          activeTab={activeTab}
          onNavigateHome={() => handleSelectTab('home')}
          onOpenConsultantModal={() => setIsConsultantModalOpen(true)}
        />

        {/* Navigation Tabs */}
        <Navbar
          items={contentData.navigation}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
        />

        {/* Global Exit Toast Notification */}
        {exitNotification && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 animate-in slide-in-from-top duration-300">
            <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🌟</span>
                <p className="text-sm font-semibold">{exitNotification}</p>
              </div>
              <button
                onClick={() => setExitNotification(null)}
                className="text-white/80 hover:text-white text-xs font-bold px-2 py-1 bg-white/20 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'home' && (
            <HomeOverview
              navItems={contentData.navigation}
              bankInfo={contentData.bankInfo}
              onSelectFeature={handleSelectTab}
              onOpenConsultant={() => setIsConsultantModalOpen(true)}
            />
          )}

          {activeTab === 'faq' && (
            <FaqSection
              faqData={contentData.faqData}
              consultant={contentData.bankInfo.consultant}
              onBackToMain={() => handleSelectTab('home')}
              onFinishSession={handleFinishSession}
            />
          )}

          {activeTab === 'download-ipay' && (
            <DownloadIpaySection data={contentData.downloadIpayData} />
          )}

          {activeTab === 'deposit-interest' && (
            <DepositInterestSection data={contentData.depositInterestData} />
          )}

          {activeTab === 'loan-schedule' && (
            <LoanScheduleSection data={contentData.loanScheduleData} />
          )}

          {activeTab === 'featured-products' && (
            <FeaturedProductsSection
              data={contentData.featuredProductsData}
              consultant={contentData.bankInfo.consultant}
            />
          )}

          {activeTab === 'branches' && (
            <BranchesSection data={contentData.branchData} />
          )}

          {activeTab === 'game' && (
            <GameSection gamesConfig={contentData.gamesConfig} />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer
        bankInfo={contentData.bankInfo}
        navItems={contentData.navigation}
        onSelectTab={handleSelectTab}
      />

      {/* Consultant Support Modal */}
      <ConsultantModal
        isOpen={isConsultantModalOpen}
        onClose={() => setIsConsultantModalOpen(false)}
        consultant={contentData.bankInfo.consultant}
      />
    </div>
  );
}
