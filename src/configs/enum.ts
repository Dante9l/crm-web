type EnumInfo = {
  value: any
  label: string
}

export enum CustomerLevel {
  ORDINARY_CUSTOMER,
  PREMIUM_CUSTOMER,
  KEY_CUSTOMER,
  OTHER
}

export enum CustomerSource {
  PERSONAL_RESOURCE,
  CUSTOMER_REFERRAL,
  OFFICIAL_WEBSITE,
  OFFICIAL_ACCOUNT,
  DOUYIN,
  XIAOHONGSHU,
  OTHER
}

export enum Gender {
  MALE,
  FEMALE,
  SECRET
}

export enum FollowUpStatus {
  NEW_CUSTOMER,
  WAITING_FOR_COMMUNICATION,
  INTERESTED,
  CONVERTED_TO_OPPORTUNITY,
  INVALID
}

export enum IntoPublicSeaStatus {
  NOT_INTO_PUBLIC_SEA,
  INTO_PUBLIC_SEA
}

export enum IsKeyDecisionMaker {
  YES,
  NO
}

export const CustomerLevelList: { [key in CustomerLevel]: EnumInfo } = {
  [CustomerLevel.ORDINARY_CUSTOMER]: { value: 0, label: '普通客户' },
  [CustomerLevel.PREMIUM_CUSTOMER]: { value: 1, label: '优质客户' },
  [CustomerLevel.KEY_CUSTOMER]: { value: 2, label: '重点客户' },
  [CustomerLevel.OTHER]: { value: 3, label: '其他' }
}

export const CustomerSourceList: { [key in CustomerSource]: EnumInfo } = {
  [CustomerSource.PERSONAL_RESOURCE]: { value: 0, label: '个人资源' },
  [CustomerSource.CUSTOMER_REFERRAL]: { value: 1, label: '客户介绍' },
  [CustomerSource.OFFICIAL_WEBSITE]: { value: 2, label: '官网咨询' },
  [CustomerSource.OFFICIAL_ACCOUNT]: { value: 3, label: '公众号' },
  [CustomerSource.DOUYIN]: { value: 4, label: '抖音' },
  [CustomerSource.XIAOHONGSHU]: { value: 5, label: '小红书' },
  [CustomerSource.OTHER]: { value: 6, label: '其他' }
}

export const FollowUpStatusList: { [key in FollowUpStatus]: EnumInfo } = {
  [FollowUpStatus.NEW_CUSTOMER]: { value: 0, label: '新客' },
  [FollowUpStatus.WAITING_FOR_COMMUNICATION]: { value: 1, label: '待再次沟通' },
  [FollowUpStatus.INTERESTED]: { value: 2, label: '有意向' },
  [FollowUpStatus.CONVERTED_TO_OPPORTUNITY]: { value: 3, label: '转入商机' },
  [FollowUpStatus.INVALID]: { value: 4, label: '无效' }
}

export const IntoPublicSeaStatusList: { [key in IntoPublicSeaStatus]: EnumInfo } = {
  [IntoPublicSeaStatus.NOT_INTO_PUBLIC_SEA]: { value: 0, label: '未转入公海' },
  [IntoPublicSeaStatus.INTO_PUBLIC_SEA]: { value: 1, label: '已转入公海' }
}

export const GenderList: { [key in Gender]: EnumInfo } = {
  [Gender.MALE]: { value: 0, label: '男' },
  [Gender.FEMALE]: { value: 1, label: '女' },
  [Gender.SECRET]: { value: 2, label: '保密' }
}

export const IsKeyDecisionMakerList: { [key in IsKeyDecisionMaker]: EnumInfo } = {
  [IsKeyDecisionMaker.YES]: { value: 0, label: '是' },
  [IsKeyDecisionMaker.NO]: { value: 1, label: '否' }
}

export enum ProductStatus {
  INITIALIZING,
  ONLINE,
  OFFLINE
}
export const ProductStatusList: { [key in ProductStatus]: EnumInfo } = {
  [ProductStatus.INITIALIZING]: { value: 0, label: '初始化' },
  [ProductStatus.ONLINE]: { value: 1, label: '上架' },
  [ProductStatus.OFFLINE]: { value: 2, label: '下架' }
}
