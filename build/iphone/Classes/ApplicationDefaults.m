/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"FM6sVcvkJItx0JI7anDVaT77ZChGYrUO"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"Act99gPQtp9SuQlANGSjLmjQ7e00T8YH"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"uOfRP76k3h4NFvDRdzR4zsnzokXQTGzz"] forKey:@"acs-api-key-production"];
    [_property setObject:[TiUtils stringValue:@"htjf6a5uZF04HX5F4BTNwVVbTeqAMtAk"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"8wKGb5sCz4P7rOLzYA9WtmAfMxnoGZ29"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"d31MVm9bgYGn0JZoHQQ7biwTDcRLPVTd"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];

    return _property;
}
@end
